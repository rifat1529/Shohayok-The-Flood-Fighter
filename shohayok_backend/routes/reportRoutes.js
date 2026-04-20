const express = require("express");
const router = express.Router();
const db = require("../config/database"); // database connection

router.post("/submit", async (req, res) => {
  const { userId, name, phone, district, subDistrict, village, peopleCount, needType } = req.body;
  
  try {
    const query = `
      INSERT INTO requests 
      (id, userId, name, phone, district, subDistrict, village, peopleCount, needType, status, createdAt, updatedAt) 
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `;

    await db.execute(query, [userId, name, phone, district, subDistrict, village, peopleCount, needType]);
    
    res.status(201).json({ message: "Request successfully submitted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;