/* eslint-disable linebreak-style */
const { ReadData, MinusPoints } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: true });
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  // Check if tribe exists in tribedata.
  const tribe = interaction.options.get("tribe").value;
  if (!tribedata.tribes[tribe]) {
    interaction.editReply({ content: "This tribe does not exist.", ephemeral: true });
    return;
  }

  var points = interaction.options.get("points").value;

  // If points is negative, return.
  if (points < 0) {
    interaction.editReply({ content: "You can't remove negative points.", ephemeral: true });
    return;
  }
  
  // If tribe has less points than points to remove, return.
  if (tribedata.tribes[tribe].Points < points) {
    interaction.editReply({ content: `This tribe only has ${tribedata.tribes[tribe].Points} points.`, ephemeral: true });
    return;
  }

  // Remove points to tribe.
  await MinusPoints(tribe, points);

  // Send log to alert channel
  const embed = {
    "title": `removePoints -  ${tribe}`,
    "description": `**Tribe:** ${tribe}\n**Points removed:** ${points}\n**Removed by:** <@${interaction.user.id}>`,
    "color": 4690898, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
      "text": "Hamza's Cult"
    }
  };

  // Send message to alert channel
  client.channels.cache.get(process.env.LogChannel).send({ embeds: [embed] });

  // Return success message.
  interaction.editReply({ content: `Removed ${points} point[s] to **${tribe}**.`, ephemeral: true });
};

exports.commandData = {
  name: "removepoints",
  description: "Removes points from a tribe (Tribe Admin only).",
  options: [

    {
      name:"tribe",
      description:"Name of the tribe you want to remove points to.",
      type:3,
      required:true
    },
    {
      name:"points",
      description:"How many points you want to remove.",
      type:4,
      required:true
    }
  ],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Cult Admin",
  guildOnly: true
};
//Tested