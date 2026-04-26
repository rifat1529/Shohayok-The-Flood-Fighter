// const express = require("express");
// const router = express.Router();
// const Instruction = require("../models/Instruction");

// // middleware (use your existing)
// const authenticate = require("../middleware/authenticate");
// const authorize = require("../middleware/authorize");


// // ==========================
// // 🔹 GET ALL (public)
// // ==========================
// router.get("/", async (req, res) => {
//   try {
//     const { type, district } = req.query;

//     let where = {};

//     if (type) where.type = type;

//     if (district) {
//       where.district = [district, null]; // show general + location
//     }

//     const data = await Instruction.findAll({
//       where,
//       order: [["priority", "DESC"], ["createdAt", "DESC"]]
//     });

//     res.json(data);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch instructions" });
//   }
// });


// // ==========================
// // 🔹 CREATE (ADMIN ONLY)
// // ==========================
// router.post("/", authenticate, authorize("admin"), async (req, res) => {
//   try {
//     const { title, content, type, district, priority } = req.body;

//     const instruction = await Instruction.create({
//       title,
//       content,
//       type,
//       district,
//       priority
//     });

//     res.json(instruction);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to create instruction" });
//   }
// });


// // ==========================
// // 🔹 DELETE (ADMIN)
// // ==========================
// router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
//   try {
//     const instruction = await Instruction.findByPk(req.params.id);

//     if (!instruction) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     await instruction.destroy();

//     res.json({ message: "Deleted" });

//   } catch (err) {
//     res.status(500).json({ message: "Failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Instruction = require("../models/Instruction");
const InstructionRead = require("../models/InstructionRead");
const Mission = require("../models/Mission");
const User = require("../models/User");

// middleware (use your existing)
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { createNotifications, missionRoom, userRoom } = require("../services/notificationService");

async function getInstructionRecipients({ targetType, missionId, receiverId, district }) {
  if (targetType === "mission") {
    const mission = await Mission.findByPk(missionId);
    if (!mission) {
      const error = new Error("Mission not found");
      error.statusCode = 404;
      throw error;
    }

    return [...new Set([mission.volunteerHeadId, ...(mission.volunteers || [])].filter(Boolean))];
  }

  if (targetType === "volunteer_head") {
    if (receiverId) return [receiverId];
    const heads = await User.findAll({
      where: {
        role: "volunteer_head",
        ...(district ? { district: String(district).toLowerCase().trim() } : {})
      },
      attributes: ["id"]
    });
    return heads.map((head) => head.id);
  }

  if (targetType === "all_volunteers") {
    const volunteers = await User.findAll({
      where: {
        role: { [Op.in]: ["volunteer", "volunteer_head"] },
        ...(district ? { district: String(district).toLowerCase().trim() } : {})
      },
      attributes: ["id"]
    });
    return volunteers.map((volunteer) => volunteer.id);
  }

  return [];
}


// ==========================
// 🔹 GET ALL (public)
// ==========================
router.get("/", async (req, res) => {
  try {
    const { type, district } = req.query;

    let where = {};

    if (type) where.type = type;

    if (district) where[Op.or] = [{ district }, { district: null }, { district: "" }];

    const data = await Instruction.findAll({
      where,
      order: [["priority", "DESC"], ["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch instructions" });
  }
});


// ==========================
// 🔹 CREATE (ADMIN ONLY)
// ==========================
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      district,
      priority,
      targetType = "public",
      missionId,
      receiverId,
      instructionType = "general"
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "title and content are required" });
    }

    const instruction = await Instruction.create({
      title,
      content,
      type: type || (targetType === "all_volunteers" ? "volunteer" : "alert"),
      district,
      priority: priority || (instructionType === "urgent" ? "high" : "low"),
      targetType,
      missionId: missionId || null,
      receiverId: receiverId || null,
      instructionType
    });

    const receiverIds = await getInstructionRecipients({
      targetType,
      missionId,
      receiverId,
      district
    });

    if (receiverIds.length > 0) {
      await InstructionRead.bulkCreate(
        receiverIds.map((userId) => ({ instructionId: instruction.id, userId })),
        { ignoreDuplicates: true }
      );

      await createNotifications({
        io: req.app.get("io"),
        receiverIds,
        type: "admin_instruction",
        messageText: `${instructionType === "urgent" ? "URGENT: " : ""}${title}`,
        data: { instructionId: instruction.id, missionId, targetType }
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("instruction:new", instruction);
      receiverIds.forEach((userId) => io.to(userRoom(userId)).emit("admin-instruction", instruction));
      if (missionId) io.to(missionRoom(missionId)).emit("admin-instruction", instruction);
    }

    res.json(instruction);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create instruction" });
  }
});

// ==========================
// 🔹 MY INSTRUCTIONS + READ STATE
// ==========================
router.get("/my", authenticate, async (req, res) => {
  try {
    const rows = await InstructionRead.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]]
    });

    const instructionIds = rows.map((row) => row.instructionId);
    const instructions = await Instruction.findAll({
      where: { id: { [Op.in]: instructionIds } },
      order: [["createdAt", "DESC"]]
    });

    const readMap = new Map(rows.map((row) => [row.instructionId, row.readAt]));

    res.json(
      instructions.map((instruction) => ({
        ...instruction.toJSON(),
        readAt: readMap.get(instruction.id) || null
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assigned instructions" });
  }
});

router.patch("/:id/read", authenticate, async (req, res) => {
  try {
    const [row] = await InstructionRead.findOrCreate({
      where: { instructionId: req.params.id, userId: req.user.id },
      defaults: { readAt: null }
    });

    const read = req.body.read !== false;
    await row.update({ readAt: read ? new Date() : null });

    res.json(row);
  } catch (err) {
    res.status(500).json({ message: "Failed to update instruction read state" });
  }
});


// ==========================
// 🔹 DELETE (ADMIN)
// ==========================
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const instruction = await Instruction.findByPk(req.params.id);

    if (!instruction) {
      return res.status(404).json({ message: "Not found" });
    }

    await instruction.destroy();

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

module.exports = router;
