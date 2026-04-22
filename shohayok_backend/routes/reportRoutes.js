const express = require("express");
const router = express.Router();

const Report = require("../models/Report");
const Mission = require("../models/Mission");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const { Op } = require("sequelize");
// ==========================
// 🔹 SUBMIT REPORT (Volunteer)
// ==========================
router.post("/submit", upload.single("image"), async (req, res) => {
  try {
    console.log("FILE:", req.file);   // ✅
    console.log("BODY:", req.body);  
    const {
      volunteerId,
      missionId,
      area,
      helpType,
      peopleHelped,
      notes
    } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "shohayok-reports"
        }
      );

      imageUrl = result.secure_url;
    }

    const report = await Report.create({
      volunteerId,
      missionId,
      area,
      helpType,
      peopleHelped,
      image: imageUrl,
      notes,
      status: "pending"
    });

    res.json({ message: "Report submitted", report });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed" });
  }
});

// ==========================
// 🔹 GET ALL REPORTS (Admin)
// ==========================
router.get("/", async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(reports);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

// ==========================
// 🔹 GET APPROVED REPORTS (Home)
// ==========================
router.get("/approved", async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: { status: "approved" }, // ✅ IMPORTANT FIX
      order: [["createdAt", "DESC"]]
    });

    res.json(reports);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch approved reports" });
  }
});



// ==========================
// 🔹 RETURN FOR CORRECTION
// ==========================
router.patch("/:id/approve", async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    await report.update({ status: "approved" });

    await Mission.update(
      {
        status: "completed",
        endedAt: new Date()
      },
      {
        where: { id: report.missionId }
      }
    );

    res.json({ message: "Report approved & mission completed" });

  } catch (err) {
    res.status(500).json({ message: "Failed to approve report" });
  }
});

router.patch("/:id/return", async (req, res) => {
  try {
    console.log("🔥 RETURN ROUTE HIT"); // debug

    const report = await Report.findByPk(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    await report.update({ status: "returned" });

    res.json({ message: "Returned successfully" });

  } catch (err) {
    res.status(500).json({ message: "Failed to return report" });
  }
});
// ==========================
// 🔹 GET VOLUNTEER REPORTS
// ==========================
router.get("/volunteer/:id", async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: {
        volunteerId: req.params.id,
        status: ["pending", "returned"] // 🔥 ONLY SHOW THESE
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(reports);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch volunteer reports" });
  }
});

router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    const {
      helpType,
      peopleHelped,
      notes
    } = req.body;

    let imageUrl = report.image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      );

      imageUrl = result.secure_url;
    }

    await report.update({
      helpType,
      peopleHelped,
      notes,
      image: imageUrl,
      status: "pending" // 🔥 BACK TO REVIEW
    });

    res.json({ message: "Report updated" });

  } catch (err) {
    res.status(500).json({ message: "Failed to update report" });
  }
});
module.exports = router;