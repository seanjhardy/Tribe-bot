const { Permissions } = require("discord.js");
require("dotenv").config();

exports.run = async (client, interaction) => {
  const target = interaction.options.getMember("target");
  const targetUsername = target.displayName;
  const targetID = target.id
  const targetObject = interaction.guild.members.cache.get(targetID);

  
   
  
//Checks if command user is a tribe mod
if (
  !interaction.member.roles.cache.find(
    (r) => r.id === process.env.TribeModRole
  )
) {
  return await interaction.reply(
    `You do not have permission (Tribe Moderator) to use this command!`
  );
}
  
  
  
  await target.timeout(null, "Tribe Timeout!");

    //send log
    const embed = {
      "title": "unsilence",
      "description": `**User:** ${target}\n**Unsilenced by:** ${interaction.user}`,
      "color": 16711680, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
      "timestamp": new Date(),
      "footer": {
        "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
        "text": "Hamza's Cult"
      }
    };
    client.channels.cache.get(process.env.LogChannel).send({ embeds: [embed] });

    // Reply to user
    return interaction.reply(`${targetUsername} has been unsilenced!`);
}

exports.commandData = {
    name: "unsilence",
    description: "UnSilence a User",
    options: [
  
  {
      name:"target",
      description:"the name of the target",
      type:6,
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
  //Tested
