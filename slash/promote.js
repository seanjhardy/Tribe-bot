const { Permissions } = require("discord.js");

const { ReadData, StoreTribe } = require("../modules/functions");
const { Roles } = require(__dirname + '/../config.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  // If user executing command is not a chief, reply with message. If user is a chief, check if user already has tribeMod role.
  if (!interaction.member.roles.cache.has(Roles.chiefRoleID)) {
    return interaction.reply(`You are not a chief.`);
  } else {
    userPromote = interaction.options.get("user").value;
    userPromoteID = userPromote.replace(/\D/g, "");
    
    // Check if user with user ID already has tribeMod role.
    if (interaction.guild.members.cache.get(userPromoteID).roles.cache.has(Roles.tribeModRoleID)) {
      return interaction.reply(`${userPromote} is already a tribe mod.`);
    } else {
      // Promote user to tribe mod.
      interaction.guild.members.cache.get(userPromoteID).roles.add(Roles.tribeModRoleID);
      return interaction.reply(`${userPromote} has been promoted to tribe mod.`);
    }
    
  }
};

exports.commandData = {
  name: "promote",
  description: "Promote a user to tribe mod.",
  options: [

{
    name:"user",
    description:"Tag/ping the user you want to promote.",
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