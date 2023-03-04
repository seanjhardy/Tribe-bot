/* eslint-disable linebreak-style */
const { ReadData, MinusPoints } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: true });
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  // Leaderboard command

  // No log needed for this command.
  };

  // Send message to alert channel
  client.channels.cache.get(process.env.LogChannel).send({ embeds: [embed] });

  // Return success message.
  interaction.editReply({ content: `Removed ${points} point[s] to **${tribe}**.`, ephemeral: true });
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