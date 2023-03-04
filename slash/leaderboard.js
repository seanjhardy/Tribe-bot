/* eslint-disable linebreak-style */
const { ReadData } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: false });
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  // Get top 10 tribes with the most points and their number of points.
  var top10 = Object.entries(tribedata.tribes).sort((a, b) => b[1].points - a[1].points).slice(0, 10);
  console.log(top10)

  // Create embed with top 10 tribes.
  const embed = new MessageEmbed()
    .setColor(4690898)
    .setTitle("Leaderboard")
    .addField(`🥇**1** ${top10}.`, `Points: ${top10}`, true)
    .setFooter("Hamza's Cult • Tribe System", "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96")

  // return the embed to user
  await interaction.reply({embeds: [embed]});
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