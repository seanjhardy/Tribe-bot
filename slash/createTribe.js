const { Permissions } = require("discord.js");
//import enmap and open the enmap.sqlite database in ../data/tribes.sqlite
const Enmap = require("enmap");
const tribes = new Enmap({ name: "tribes" });

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  // CreateTribe Command
  const name = interaction.options.getString("name");
  const emoji = interaction.options.getString("emoji");
  if (tribes.has(name)) { // Check if tribes exists
    return interaction.reply("This tribe name is already taken");
  } else {
    tribes.set(name, emoji);
    interaction.guild.roles.create({
      data: {
        name: name,
        color: 0,
        permissions: [],
      },
    });
    return interaction.reply(`Tribe "**${name}**" with emoji **${emoji}** created`);
  }
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
  permLevel: "Bot Admin",
  guildOnly: true
};