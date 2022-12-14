const { Permissions, Guild, ChannelManager } = require("discord.js");

const { ReadData, StoreTribe, RemoveTribe } = require("../modules/functions");


exports.run = async (client, interaction) => {
    const name = interaction.options.getString("name");
    const tribedataraw = await ReadData();
    const tribeData = JSON.parse(tribedataraw);

    if (!(name in tribeData.tribes))

    {
        return interaction.reply("That Tribe Doesn't Exist!");
    }
    else
    {
        const tribetoremove = tribeData.tribes[name];
        const roleid = tribetoremove.RoleID;
        const catagoryid = tribetoremove.Category;
        await interaction.guild.roles.fetch(roleid).then(role => {if (role) {role.delete()}});
        await interaction.guild.channels.fetch(catagoryid).then(channels => {console.log(channels.children.forEach(channel => {channel.delete()}));})
        await interaction.guild.channels.fetch(catagoryid).then(channels => channels.delete())
        RemoveTribe(name);
        return interaction.reply("Successfully Deleted The Tribe!");
    }
};
exports.commandData = {
    name: "removetribe",
    description: "Removes The Provided Tribe",
    options: [
  
  {
      name:"name",
      description:"the name of the tribe you want to remove",
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