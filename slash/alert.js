/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const { Permissions, EmbedBuilder } = require("discord.js");

const { ReadData, StoreTribe } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  messageID = interaction.options.get("message").value; // Message ID or Message Link from executor

  // Check if messageID is a link and get message ID from link
  if (messageID.includes("://")) {
    messageID = messageID.split("/").pop(); // Get message ID from link
  }

  // Get message object.
  message = await interaction.channel.messages.fetch(messageID);
  messageContent = message.content; // Message content
  messageAuthorID = message.author.id; // Message author ID
  messageAuthorUsername = message.author.username + "#" + message.author.discriminator; // Message author ID
  messageChannelID = message.channel.id; // Message channel ID
  messageCategoryID = message.channel.parent.id; // Message category ID


  reporterID = interaction.user.id; // Reporter ID
  
  // Roles of person reported
  victimRoles = interaction.guild.members.cache.get(messageAuthorID).roles.cache.map(r => r.name);

  // Roles of person reporting
  executorRoles = interaction.member.roles.cache.map(r => r.name);

  // Find common roles between users
  commonRoles = victimRoles.filter(value => executorRoles.includes(value));

  // Check if any of common roles are in tribedata.
  var tribe = "";
  var tribeCategory = "";
  var tribeRoleID = "";
  for (var i = 0; i < commonRoles.length; i++) {
    if (tribedata.tribes[commonRoles[i]]) {
      tribe = commonRoles[i];
      tribeCategory = tribedata.tribes[tribe].Category;
      tribeRoleID = tribedata.tribes[tribe].RoleID;
      break;
    }
  }

  // Check if message is in tribeCategory
  if (tribe == "" || message.channel.parent != tribeCategory) {
    interaction.reply({ content: "You can only alert the mods of a message in your tribe category.", ephemeral: true }); // Send message to user
    return;
  }

  // Reply to messageID in the channel the command was executed in.

  return interaction.reply({ content: "Alerted the mods of the message. Thank you for your report.", ephemeral: true });
};

exports.commandData = {
  name: "alert",
  description: "Alert tribe mods to a message by replying to the message.",
  options: [

    {
      name:"message",
      description:"Enter the message link or ID of the user you want to alert the mods of.",
      type:3,
      required:true
    }
  ],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};
//Tested