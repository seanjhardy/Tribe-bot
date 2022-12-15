const { Permissions } = require("discord.js");

const { ReadData, StoreTribe, SetLimit } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => {
    const limitamount = interaction.options.getInteger("limit");

    SetLimit(limitamount);

    // log to log channel
    const embed = {
      "title": "setLimit",
      "description": `**User:** ${interaction.user}\n**Limit:** ${limitamount}`,
      "color": 4690898, // 16711680 = red for moderation logs | 4690898 = pink/purplish for other commands
      "timestamp": new Date(),
      "footer": {
        "icon_url": "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96",
        "text": "Hamza's Cult"
      }
    };
    client.channels.cache.get(process.env.LogChannel).send({ embeds: [embed] });

    // set limit
    if (limitamount === -1)
    {
        return interaction.reply("Successfully Set No Limit!");
    }
    else
    {
        return interaction.reply("Successfully Set Limit!");
    }
};

exports.commandData = {
    name: "setlimit",
    description: "Sets the Global Limit of Members that can be in a Tribe",
    options: [
  
  {
      name:"limit",
      description:"The Limit (-1 to have none)",
      type:4,
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