const { Permissions } = require("discord.js");

const { ReadData, StoreTribe } = require("../modules/functions");
const { Roles } = require(__dirname + '/../config.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  // Check if executor has chief role.
  if (!interaction.member.roles.cache.has(Roles.chiefRoleID)) {
    return interaction.reply(`You are not a chief.`);
  } else {
    // Get user ID and their tribe.
    userPromote = interaction.options.get("user").value;
    userPromoteID = userPromote.replace(/\D/g, "");

    // Check if user with user ID already has tribeMod role.
    if (interaction.guild.members.cache.get(userPromoteID).roles.cache.has(Roles.tribeModRoleID)) {
      interaction.guild.members.cache.get(userPromoteID).roles.remove(Roles.tribeModRoleID);
      return interaction.reply(`${userPromote} has been demoted from tribe mod.`);
    } else {
      // Remove tribe mod role from user.
      return interaction.reply(`${userPromote} doesn't have tribe mod role.`);
    }
  }
};

exports.commandData = {
  name: "demote",
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