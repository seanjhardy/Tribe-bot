const { Permissions } = require("discord.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  //Checks if user has permissions
  if (!interaction.member.roles.cache.some(role => role.name === 'MOD ROLE NAME')) {
    return await interaction.reply("You do not have permission to create a tribe");
  }
   

  //Checks if bot has permissions
  if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
    return await interaction.reply("MISSING PERMISSION: MANAGE_CHANNELS");
  }

  if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
    return await interaction.reply("MISSING PERMISSION: MANAGE_ROLES");
  }

 
  //Checks if tribe already exists
  let roleName = interaction.options.getString('name');
  let role = interaction.guild.roles.cache.find(x => x.name === roleName);
  if (!typeof role === undefined) {
    return await interaction.reply(`Tribe: ${roleName} already exists!`);
  }

  //Creates tribe and assocciated chanel
  return await interaction.reply(`Error Handling Complete!`);
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
};

exports.commandData = {
  name: "createtribe",
  description: "Creates a new tribe",
  options: [

{
    name:"name",
    description:"the name of the tribe you want to create",
    type:3,
    required:true
},
{
    name:"emoji",
    description:"the emoji of the tribe you want to create",
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