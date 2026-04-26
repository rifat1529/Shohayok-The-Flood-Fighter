const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Notification = require("../models/Notification");

router.get("/", authenticate, async (req, res) => {
  try {
    const where = { receiverId: req.user.id };
    if (req.query.read === "true") where.readStatus = true;
    if (req.query.read === "false") where.readStatus = false;

    const notifications = await Notification.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: Math.min(Number(req.query.limit || 30), 100)
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.patch("/:id/read", authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, receiverId: req.user.id }
    });

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    const read = req.body.read !== false;
    await notification.update({ readStatus: read, readAt: read ? new Date() : null });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

module.exports = router;
