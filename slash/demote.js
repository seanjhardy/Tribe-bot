const { Permissions } = require("discord.js");

const { ReadData, StoreTribe } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  // Check if executor has chief role.
  if (!interaction.member.roles.cache.has(process.env.ChiefRole)) {
    return interaction.reply("You are not a chief.");
  } else {
    // Get user ID and their tribe.
    userDemote = interaction.options.get("user").value;
    userDemoteID = userDemote.replace(/\D/g, "");
    // userRoles containing all of user's role names in an array.
    userRoles = interaction.guild.members.cache.get(userDemoteID).roles.cache.map(r => r.name);

    // Get the roles of executor.
    executorRoles = interaction.member.roles.cache.map(r => r.name);

    // Find common roles between executor and user.
    commonRoles = userRoles.filter(value => executorRoles.includes(value))
    
    // Check if any of common roles are in tribedata.
    var tribe = "";
    for (var i = 0; i < commonRoles.length; i++) {
      if (tribedata[commonRoles[i]]) {
        tribe = commonRoles[i];
        break;
      }
    }
    console.log("Tribe: " + tribe)
    // Check if user is in the tribe.
    if (tribe == "") {
      return interaction.reply(`${userDemote} is not in your tribe.`);
    } else {
      // Check if user with user ID already has tribeMod role.
      if (interaction.guild.members.cache.get(userDemoteID).roles.cache.has(process.env.TribeModRole)) {
        interaction.guild.members.cache.get(userDemoteID).roles.remove(process.env.TribeModRole);
        return interaction.reply(`${userDemote} has been demoted from tribe mod.`);
      } else {
        // Remove tribe mod role from user.
        return interaction.reply(`${userDemote} doesn't have tribe mod role.`);
      }
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