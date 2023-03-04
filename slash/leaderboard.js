/* eslint-disable linebreak-style */
const { ReadData } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => {
  // eslint-disable-line no-unused-vars
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  tribes = tribedata.tribes
  // Sort tribes by points in ascending order
  const sortedTribes = Object.entries(tribes)
  .sort(([, a], [, b]) => b.Points - a.Points)
  .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const sortedKeys = Object.keys(sortedTribes);


  // Create function to conntattonate string
  function lbLine(index) {
    // If index position is undefined, return nothing
    if (sortedKeys[index] === undefined) return "";
    return `${index + 1}. ${sortedKeys[index]} - **${tribes[sortedKeys[index]].Points} points**\n`;
  }
  // Create embed
  const embed = {
    "title": "Banish",
    "description": `${lbLine(0)}` + `${lbLine(1)}` + `${lbLine(2)}` + `${lbLine(3)}` + `${lbLine(4)}` + `${lbLine(5)}` + `${lbLine(6)}` + `${lbLine(7)}` + `${lbLine(8)}` + `${lbLine(9)}`,
    "color": 16711680, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
      "text": "Hamza's Cult"
    }
  };
  // Send leaderboard
  interaction.reply({ embeds: [embed] });
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

// Tested and working as of 10/10/2021