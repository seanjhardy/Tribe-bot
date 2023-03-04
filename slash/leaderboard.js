/* eslint-disable linebreak-style */
const { ReadData, MinusPoints } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: true });
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  // Get top 10 tribes with the most points.
  var top10 = Object.keys(tribedata.tribes).sort((a, b) => tribedata.tribes[b].Points - tribedata.tribes[a].Points).slice(0, 10);
  console.log(top10)

  // No log needed for this command.
};

exports.commandData = {
  name: "leaderboard",
  description: "Displays top 10 tribes with the most points.",
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};
//Tested