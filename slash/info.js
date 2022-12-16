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
    .setTitle("Information")
    .addField("🏓 Ping", `${Math.round(client.ws.ping)}ms`, true)
    .addField("⏲ Uptime", `${duration}`, true)
    .addField("🗄 Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .addField("📝 Users", `${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString()}`, true)
    .addField("🥇 Tribes", `${numTribes}`, true)
    .addField("👓 Limit", `${tribes.Limit}`, true)
    .setFooter("Hamza's Cult • Tribe System", "https://cdn.discordapp.com/icons/811270187843977236/5a7ac443be8f92675def615e470ac4a6.webp?size=96")
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
  permLevel: "Cult Admin",
  guildOnly: false
};
