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
    userPromote = interaction.options.get("user").value;
    userPromoteID = userPromote.replace(/\D/g, "");
    // userRoles containing all of user's role names in an array.
    userRoles = interaction.guild.members.cache.get(userPromoteID).roles.cache.map(r => r.name);

    // Get the roles of executor.
    executorRoles = interaction.member.roles.cache.map(r => r.name);

    // Find common roles between executor and user.
    commonRoles = userRoles.filter(value => executorRoles.includes(value));
    
    // Check if any of common roles are in tribedata.
    var tribe = "";
    for (var i = 0; i < commonRoles.length; i++) {
      if (tribedata.tribes[commonRoles[i]]) {
        tribe = commonRoles[i];
        break;
      }
    }
    // Check if user is in the tribe.
    if (tribe == "") {
      return interaction.reply(`${userPromote} is not in your tribe.`);
    } else {
      // Check if user with user ID already has tribeMod role.
      if (interaction.guild.members.cache.get(userPromoteID).roles.cache.has(process.env.TribeModRole)) {
        return interaction.reply(`${userPromote} already has tribe mod role.`);
      } else {
        // Add tribe mod role from user.
        interaction.guild.members.cache.get(userPromoteID).roles.add(process.env.TribeModRole);

        // Send log as embed to env log channel.
        const embed = {
          "title": "Promotion",
          "description": `**User:** ${userPromote}\n**Tribe:** ${tribe}\n**Demoted by:** ${interaction.user}`,
          "color": 16711680, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
          "timestamp": new Date(),
          "footer": {
            "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
            "text": "Hamza's Cult"
          }
        };
        client.channels.cache.get(process.env.LogChannel).send({ embeds: [embed] });

        // Reply to user.
        return interaction.reply(`${userPromote} has been promoted to tribe moderator.`);
      }
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