const { Permissions } = require("discord.js");
require("dotenv").config();

exports.run = async (client, interaction) => {
    const user = interaction.options.getMember("user");
    const username = user.displayName;
    await user.timeout(4 * 60 * 60 * 1000, "Tribe Timeout!");

    // Send log as embed to env log channel.
    const embed = {
      "title": "silence",
      "description": `**User:** ${user}\n**Silenced by:** ${interaction.user}`,
      "color": 16711680, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
      "timestamp": new Date(),
      "footer": {
        "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
        "text": "Hamza's Cult"
      }
    };
    client.channels.cache.get(process.env.LogChannel).send({ embeds: [embed] });

    // reply to user
    return interaction.reply(`${username} has been silenced!`);
}
exports.commandData = {
    name: "silence",
    description: "Silence a User",
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