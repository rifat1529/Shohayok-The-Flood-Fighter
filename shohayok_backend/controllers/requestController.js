const Request = require("../models/Request");
const AcceptedRequest = require("../models/AcceptedRequest");
const User = require("../models/User");
const Mission = require("../models/Mission");
const Alert = require("../models/Alert");

const { sendAdminAlert, sendMissionEmail } = require("../utils/email");

// ==========================
// 🔹 HELPER
// ==========================
const getArea = (r) => `${r.district}`;

// ==========================
// 🔹 CREATE GUEST REQUEST
// ==========================
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

    const count = await Request.count({
      where: { district, subDistrict, status: "pending" }
    });

    if (count === 5) {
      await sendAdminAlert(`${district}, ${subDistrict}`, count);
    }

    return res.status(201).json({ message: "Request submitted", request });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to submit request" });
  }
};

// ==========================
// 🔹 CREATE USER REQUEST
// ==========================
const createUserRequest = async (req, res) => {
  try {
    const { trapped, need, district, subDistrict, village } = req.body;

    if (!trapped || !need || !district || !subDistrict || !village) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const request = await Request.create({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      district,
      subDistrict,
      village,
      peopleCount: trapped,
      needType: need,
      status: "pending"
    });

    const count = await Request.count({
      where: { district, subDistrict, status: "pending" }
    });

    if (count === 5) {
      await sendAdminAlert(`${district}, ${subDistrict}`, count);
    }

    return res.status(201).json({ message: "Request submitted", request });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to submit request" });
  }
};

// ==========================
// 🔹 GET ALL REQUESTS + ALERT
// ==========================
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      order: [["createdAt", "DESC"]]
    });

    const areaMap = {};

    requests
      .filter(r => r.status === "pending")
      .forEach((r) => {
        const key = getArea(r);
        areaMap[key] = (areaMap[key] || 0) + 1;
      });

    const alerts = Object.entries(areaMap)
      .filter(([_, count]) => count >= 5)
      .map(([area, count]) => ({ area, count }));

    return res.json({ requests, alerts });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch requests" });
  }
};

// ==========================
// 🔹 GET ACCEPTED REQUESTS
// ==========================
const getAcceptedRequests = async (req, res) => {
  try {
    const requests = await AcceptedRequest.findAll({
      order: [["createdAt", "DESC"]]
    });

    return res.json(requests);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch accepted requests" });
  }
};

// ==========================
// 🔹 UPDATE REQUEST STATUS
// ==========================
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    const district = request.district?.toLowerCase().trim() || "unknown";
    // =====================
    // ✅ APPROVE
    // =====================
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

      await request.update({ status: "approved" });
      const district = request.district?.toLowerCase().trim() || "unknown";
      // 🚁 MISSION
   const approvedCount = await AcceptedRequest.count({
  where: { district }
});

if (approvedCount >= 3) {

  const existingMission = await Mission.findOne({
    where: { district, status: "active" }
  });

  if (!existingMission) {

    const volunteerHead = await User.findOne({
      where: { role: "volunteer_head", district }
    });

    if (volunteerHead) {

      const mission = await Mission.create({
        district,
        status: "active",
        volunteerHeadId: volunteerHead.id
      });

      console.log("🚁 Mission created:", mission.id);

      const io = req.app.get("io");

      if (io) {
        io.emit("mission", {
          message: `🚁 Mission created in ${district}`,
          missionId: mission.id,
          district
        });
      }

      // 📧 EMAIL → HEAD
      await sendMissionEmail(volunteerHead.email, district);

      // 📧 EMAIL → VOLUNTEERS
      const volunteers = await User.findAll({
        where: { role: "volunteer", district }
      });

      for (const v of volunteers) {
        await sendMissionEmail(v.email, district);
      }
    }
  }
}

      // 🚨 ALERT (5+ requests)
      const totalRequests = await Request.count({ where: { district } });

      if (totalRequests >= 5) {

        const existingAlert = await Alert.findOne({
          where: { district, status: "active" }
        });

        if (!existingAlert) {

          await Alert.create({
            district,
            status: "active"
          });

          console.log("🚨 Alert triggered in:", district);

          const io = req.app.get("io");
          if (io) {
            io.emit("emergency-alert", {
              message: `🚨 Emergency Alert in ${district}`
            });
          }
        }
      }

      return res.json({ message: "Request approved" });
    }

    // =====================
    // ❌ DECLINE
    // =====================
    await request.update({ status: "declined" });

    return res.json({ message: "Request declined" });

  } catch (err) {
    console.error("🔥 ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ==========================
module.exports = {
  createGuestRequest,
  createUserRequest,
  getAllRequests,
  getAcceptedRequests,
  updateRequestStatus
};
