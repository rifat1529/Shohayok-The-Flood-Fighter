console.log("BODY:", req.body);
console.log("FILES:", req.files);
const mission = await Mission.findByPk(missionId);

const joinCount = mission.volunteers.length;

res.json({
  totalVolunteers: joinCount
});