// const User = require("../models/User");

// // 🔥 MAKE VOLUNTEER HEAD
// exports.makeVolunteerHead = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // ❌ only volunteer can be promoted
//     if (user.role !== "volunteer") {
//       return res.status(400).json({ message: "Only volunteer can be head" });
//     }

//     // 🔍 find old head in same district
//     const oldHead = await User.findOne({
//       where: {
//         role: "volunteer_head",
//         district: user.district
//       }
//     });

//     // 🔽 downgrade old head
//     if (oldHead) {
//       oldHead.role = "volunteer";
//       await oldHead.save();
//     }

//     // 🔼 promote new head
//     user.role = "volunteer_head";
//     user.headId = null;
//     await user.save();

//     // 🔗 assign all volunteers under new head
//     await User.update(
//       { headId: user.id },
//       {
//         where: {
//           district: user.district,
//           role: "volunteer"
//         }
//       }
//     );

//     return res.json({
//       message: "Volunteer promoted to head successfully"
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const User = require("../models/User");
const sequelize = require("../config/database");
const { createNotification } = require("../services/notificationService");

// 🔥 MAKE VOLUNTEER HEAD
exports.makeVolunteerHead = async (req, res) => {
  try {
    const userId = req.params.id;

    await sequelize.transaction(async (transaction) => {
      const user = await User.findByPk(userId, { transaction, lock: transaction.LOCK.UPDATE });

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      // ❌ only volunteer can be promoted
      if (user.role !== "volunteer") {
        const error = new Error("Only volunteer can be head");
        error.statusCode = 400;
        throw error;
      }

      // 🔍 find old head in same district
      const oldHead = await User.findOne({
        where: {
          role: "volunteer_head",
          district: user.district
        },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      // 🔽 downgrade old head
      if (oldHead) {
        oldHead.role = "volunteer";
        await oldHead.save({ transaction });
      }

      // 🔼 promote new head
      user.role = "volunteer_head";
      user.headId = null;
      await user.save({ transaction });

      // 🔗 assign all volunteers under new head
      await User.update(
        { headId: user.id },
        {
          where: {
            district: user.district,
            role: "volunteer"
          },
          transaction
        }
      );

      await createNotification(
        {
          io: req.app.get("io"),
          receiverId: user.id,
          type: "role_promoted",
          messageText: "You have been promoted to Volunteer Head.",
          data: { district: user.district }
        },
        { transaction }
      );
    });

    return res.json({
      message: "Volunteer promoted to head successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
  }
};
