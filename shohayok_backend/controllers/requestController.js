const Request = require("../models/Request");
const AcceptedRequest = require("../models/AcceptedRequest");

const createGuestRequest = async (req, res) => {
  try {
    const { name, phone, district, subDistrict, village, trapped, need } = req.body;

    if (!name || !phone || !district || !subDistrict || !village || !trapped || !need) {
      return res.status(400).json({ message: "All guest fields required" });
    }

    const request = await Request.create({
      name,
      phone,
      district,
      subDistrict,
      village,
      peopleCount: trapped,
      needType: need,
      status: "pending"
    });

    return res.status(201).json({ message: "Request submitted", request });
  } catch (err) {
    return res.status(500).json({ message: "Failed to submit request" });
  }
};

const createUserRequest = async (req, res) => {
  try {
    const { trapped, need, district, subDistrict, village } = req.body;

    if (!trapped || !need) {
      return res.status(400).json({ message: "trapped and need required" });
    }

    const request = await Request.create({
      userId: req.user.id,
      district,
      subDistrict,
      village,
      peopleCount: trapped,
      needType: need,
      status: "pending"
    });

    return res.status(201).json({ message: "Request submitted", request });
  } catch (err) {
    return res.status(500).json({ message: "Failed to submit request" });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const requests = await Request.findAll({ where, order: [["createdAt", "DESC"]] });
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch requests" });
  }
};

const getAcceptedRequests = async (req, res) => {
  try {
    const requests = await AcceptedRequest.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch accepted requests" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    if (status === "approved") {
      await AcceptedRequest.create({
        originalRequestId: request.id,
        userId: request.userId,
        name: request.name,
        phone: request.phone,
        district: request.district,
        subDistrict: request.subDistrict,
        village: request.village,
        peopleCount: request.peopleCount,
        needType: request.needType,
        status: "approved"
      });

      await request.destroy(); // approved হলে requests থেকে remove
      return res.json({ message: "Request approved and moved" });
    }

    await request.update({ status: "declined" });
    return res.json({ message: "Request declined", request });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update status" });
  }
};

module.exports = {
  createGuestRequest,
  createUserRequest,
  getAllRequests,
  getAcceptedRequests,
  updateRequestStatus
};