const { Permissions, MessageEmbed } = require("discord.js");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

const { ReadData, StoreTribe, RemoveTribe, removeBanishes } = require("../modules/functions");



exports.run = async (client, interaction) => {

  const targetID = interaction.options.getUser("target").id;
  await removeBanishes(targetID)
  return await interaction.reply(
    `Banishes removed!`
  );
};

exports.commandData = {
  name: "removebanish",
  description: "Removes all banish history from a user",
  options: [
    {
      name: "target",
      description: "The user you would like to banish from the tribe",
      type: 6,
      required: true,
    },
  ],
  defaultPermission: true,
};
  
// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Cult Admin",
  guildOnly: false
};
