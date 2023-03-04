/* eslint-disable linebreak-style */
const { ReadData } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
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
  function concatString(index) {
    return `${index + 1}. ${sortedKeys[index]} - **${tribes[sortedKeys[index]].Points} points**\n`;
  }
  console.log(sortedKeys)
  // Create embed
  const embed = {
    "title": "Banish",
    "description": `🥇1. ${sortedKeys[0]} - **${tribes[sortedKeys[0]].Points} points**` + `🥈2. ${sortedKeys[1]} - **${tribes[sortedKeys[1]].Points} points**`,
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