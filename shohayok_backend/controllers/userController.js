const User = require("../models/User");

// 🔥 MAKE VOLUNTEER HEAD
exports.makeVolunteerHead = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ only volunteer can be promoted
    if (user.role !== "volunteer") {
      return res.status(400).json({ message: "Only volunteer can be head" });
    }

    // 🔍 find old head in same district
    const oldHead = await User.findOne({
      where: {
        role: "volunteer_head",
        district: user.district
      }
    });

    // 🔽 downgrade old head
    if (oldHead) {
      oldHead.role = "volunteer";
      await oldHead.save();
    }

    // 🔼 promote new head
    user.role = "volunteer_head";
    user.headId = null;
    await user.save();

    // 🔗 assign all volunteers under new head
    await User.update(
      { headId: user.id },
      {
        where: {
          district: user.district,
          role: "volunteer"
        }
      }
    );

    return res.json({
      message: "Volunteer promoted to head successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};