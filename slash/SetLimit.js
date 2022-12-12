const { Permissions } = require("discord.js");

const { ReadData, StoreTribe, SetLimit } = require("../modules/functions");

exports.run = async (client, interaction) => {
    const limitamount = interaction.options.getInteger("limit");

    SetLimit(limitamount);

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
    permLevel: "Bot Admin",
    guildOnly: true
  };