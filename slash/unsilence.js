const { Permissions } = require("discord.js");
require("dotenv").config();

exports.run = async (client, interaction) => {
    const user = interaction.options.getMember("user");
    const username = user.displayName;
    await user.timeout(null, "Tribe Timeout!");

    //send log
    const embed = {
      "title": "unsilence",
      "description": `**User:** ${user}\n**Unsilenced by:** ${interaction.user}`,
      "color": 16711680, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
      "timestamp": new Date(),
      "footer": {
        "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
        "text": "Hamza's Cult"
      }
    };
    client.channels.cache.get(process.env.LogChannel).send({ embeds: [embed] });

    // Reply to user
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