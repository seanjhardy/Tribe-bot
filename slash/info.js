const { Permissions, MessageEmbed } = require("discord.js");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

const { ReadData, StoreTribe, RemoveTribe } = require("../modules/functions");
require("dotenv").config();


exports.run = async (client, interaction) => {
  const name = interaction.options.getString("name");
  const tribedataraw = await ReadData();
  const tribes = JSON.parse(tribedataraw);
  const duration = durationFormatter.format(client.uptime);

  const numTribes = Object.keys(tribes).length - 1;  // Store the number of items in tribes
  // Create an embed with 2 inline fields
  const embed = new MessageEmbed()
    .setColor(4690898)
    .setTitle("Bot Information")
    .addField("Ping 🏓", `${Math.round(client.ws.ping)}ms`, true)
    .addField("Uptime ⏲ ", `${duration}`, true)
    .addField("Memory Usage 🗄", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .addField("Users 📝", `${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString()}`, true)
    .addField("Tribes 🥇", `${numTribes}`, true)
    .addField("Limit 👓", `${tribes.Limit}`, true)
    .setThumbnail("https://media.discordapp.net/attachments/1051261955882623008/1051878553899245638/tribes.png");

  // return the embed to user
  await interaction.reply({embeds: [embed]});
};
exports.commandData = {
  name: "info",
  description: "Bot Information",
  defaultPermission: true,
};
  
// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true
};