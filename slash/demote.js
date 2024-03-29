const { Permissions } = require("discord.js");

const { ReadData, StoreTribe } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ephemeral:true});
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  // Check if executor has chief role.

  // Get user ID and their tribe.
  const userDemote = interaction.options.get("user").value;
  const userDemoteID = userDemote.replace(/\D/g, "");
  // userRoles containing all of user's role names in an array.
  const userRoles = interaction.guild.members.cache.get(userDemoteID).roles.cache.map(r => r.name);

  // Get the roles of executor.
  const executorRoles = interaction.member.roles.cache.map(r => r.name);

  // Find common roles between executor and user.
  const commonRoles = userRoles.filter(value => executorRoles.includes(value));
    
  // Check if any of common roles are in tribedata.
  var tribe = "";
  for (var i = 0; i < commonRoles.length; i++) {
    if (tribedata.tribes[commonRoles[i]]) {
      tribe = commonRoles[i];
      break;
    }
  }
  // Check if user is in the tribe.
  if (tribe === "") {
    return interaction.editReply(`${userDemote} is not in your tribe.`);
  } else {
    // Check if user with user ID already has tribeMod role.
    if (interaction.guild.members.cache.get(userDemoteID).roles.cache.has(process.env.tribeModRole)) {
      interaction.guild.members.cache.get(userDemoteID).roles.remove(process.env.tribeModRole);
        
      // Send log as embed to env log channel.
      const embed = {
        "title": "Demotion",
        "description": `**User:** ${userDemote}\n**Tribe:** ${tribe}\n**Demoted by:** ${interaction.user}`,
        "color": 16711680, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
        "timestamp": new Date(),
        "footer": {
          "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
          "text": "Hamza's Cult"
        }
      };
      client.channels.cache.get(process.env.LogChannel).send({ embeds: [embed] });
  
      // Remove tribe mod role from user.
      return interaction.editReply(`${userDemote} has been demoted from tribe mod.`);
    } else {
      // Remove tribe mod role from user.
      return interaction.editReply(`${userDemote} doesn't have tribe mod role.`);
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
  permLevel: "Tribe Chief",
  guildOnly: true
};
//Tested