const { Permissions } = require("discord.js");

exports.run = async (client, interaction) => {
    const user = interaction.options.getMember("user");
    const username = user.displayName;
    await user.timeout(null, "Tribe Timeout!");
    return interaction.reply(`${username} has been unsilenced!`);
}

exports.commandData = {
    name: "unsilence",
    description: "UnSilence a User",
    options: [
  
  {
      name:"user",
      description:"the name of the tribe you want to create",
      type:6,
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