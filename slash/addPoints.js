/* eslint-disable linebreak-style */
const { ReadData, StoreTribe } = require("../modules/functions");
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
    interaction.editReply({ content: "You can't add negative points.", ephemeral: true });
    return;
  }

  // Add points to tribe.
  tribedata.tribes[tribe].Points += points;

  // Send log to alert channel
  const embed = {
    "title": `Alert -  ${tribe}`,
    "description": `**User Reported:** <@${messageAuthorID}>\n**Tribe:** ${tribe}\n**Reported by:** <@${interaction.user.id}>\n**Message ID: **${messageID}`,
    "fields": [
      {
        "name": "Message Content: ",
        "value": "```"+`${messageContent}`+"```"
      }
    ],
    "color": 4690898, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
    "timestamp": new Date(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
      "text": "Hamza's Cult"
    }
  };

  // Send message to alert channel
  const alertChannel = client.channels.cache.get(process.env.ALERT_CHANNEL_ID);
  alertChannel.send({ embeds: [embed] });

  // Return success message.
  interaction.editReply({ content: `Added ${points} points to ${tribe}.`, ephemeral: true });
};

exports.commandData = {
  name: "addpoints",
  description: "Add points to a tribe (Tribe Admin only).",
  options: [

    {
      name:"tribe",
      description:"Name of the tribe you want to add points to.",
      type:3,
      required:true
    },
    {
      name:"points",
      description:"How many points you want to add.",
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