const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ==========================
// 🔐 OTP EMAIL
// ==========================
async function sendOtpEmail(to, otp) {
  try {
    await transporter.sendMail({
      from: `"Shohayok" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Shohayok Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Do not share this code.</p>
      `
    });

    console.log("📧 OTP email sent");

  } catch (err) {
    console.error("❌ OTP EMAIL ERROR:", err);
    throw err;
  }
}

// ==========================
// 🚨 ADMIN ALERT
// ==========================
async function sendAdminAlert(area, count) {
  try {
    await transporter.sendMail({
      from: `"Shohayok Alert" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🚨 Emergency Alert",
      html: `
        <h2>🚨 Emergency Alert</h2>
        <p><strong>Area:</strong> ${area}</p>
        <p><strong>Total Requests:</strong> ${count}</p>
      `
    });

    console.log("📧 Admin alert sent");

  } catch (err) {
    console.error("❌ ADMIN EMAIL ERROR:", err);
  }
}

// ==========================
// 🚁 MISSION EMAIL
// ==========================
async function sendMissionEmail(to, district) {
  try {
    await transporter.sendMail({
      from: `"Shohayok Mission" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🚁 Mission Assigned",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2 style="color:#ef4444;">🚁 New Mission</h2>
          <p>Area: <b>${district}</b></p>
          <p>Please login and join immediately.</p>
        </div>
      `
    });

    console.log(`📧 Mission email sent to ${to}`);

  } catch (err) {
    console.error("❌ MISSION EMAIL ERROR:", err);
  }
}

module.exports = {
  sendOtpEmail,
  sendAdminAlert,
  sendMissionEmail
};