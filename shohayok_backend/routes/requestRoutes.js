const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  createGuestRequest,
  createUserRequest,
  getAllRequests,
  getAcceptedRequests,
  updateRequestStatus
} = require("../controllers/requestController");

router.post("/guest", createGuestRequest);
router.post("/", authenticate, createUserRequest);

router.get("/", authenticate, authorize("admin"), getAllRequests);
router.get("/accepted", authenticate, authorize("admin"), getAcceptedRequests);

router.patch("/:id/status", authenticate, authorize("admin"), updateRequestStatus);

module.exports = router;