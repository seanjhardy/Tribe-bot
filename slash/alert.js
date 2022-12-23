/* eslint-disable linebreak-style */
const { Permissions } = require("discord.js");

const { ReadData, StoreTribe } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  messageID = interaction.options.get("message").value; // Message ID
  // Get message object.
  message = await interaction.channel.messages.fetch(messageID);
  console.log(message.content);
};

exports.commandData = {
  name: "alert",
  description: "Alert tribe mods to a message by replying to the message.",
  options: [

    {
      name:"message",
      description:"Message ID of the user you want to alert the mods of.",
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