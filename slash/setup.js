const { Permissions, MessageEmbed, MessageActionRow, MessageButton, Role } = require("discord.js");

const { ReadData, StoreTribe, SetLimit } = require("../modules/functions");
const wait = require("node:timers/promises").setTimeout;

exports.run = async (client, interaction) => {
  await interaction.reply({content:"Successfully Created", ephemeral:true});
  const embed = new MessageEmbed()
    .setColor(0x0099FF)
    .setTitle("╣JOIN A TRIBE╠")
    .setDescription("Build friendships, improve your leadership and compete to be the strongest of them all!\n\n" +
        "You will be randomly assigned a tribe of around 150 members, but **BEWARE**, tribe leaders and mods " +
        "have the power to __silence__ and __banish__ you from the tribe, and you will need to wait a week before being able to join another.")

    .setImage("https://media.discordapp.net/attachments/1051261955882623008/1051878553899245638/tribes.png");
  const row = new MessageActionRow()
    .addComponents(new MessageButton().setLabel("JOIN TRIBE").setStyle("PRIMARY").setCustomId("TribeBut"));
  const channelid = interaction.channelId;
  await interaction.guild.channels.fetch(channelid).then(async channelo => {
    channelo.send({embeds: [embed], components: [row]});
  });
  const filter = i => i.customId === "TribeBut";
  const collector = interaction.channel.createMessageComponentCollector({filter});
  collector.on("collect", async i =>{
    //i.user.id to get user id
    await i.deferUpdate();
    const tribedataraw = await ReadData();
    const tribedata = JSON.parse(tribedataraw);
    // filter out limit key from tribe data using object.fromentrie
    const roleids = Object.entries(tribedata).filter(([key]) => key !== "Limit").map(([key, value]) => value.RoleID);
    if (roleids.length === 0) {
      return i.followUp({content: "There is no Tribes to Join!", ephemeral: true});
    }
    const members = await i.guild.members.fetch();
    const membercounts = await Promise.all(roleids.map(async roleid => {
      const role = await i.guild.roles.cache.get(roleid);
      const memberCount = role.members.size;

      if (i.member.roles.cache.has(roleid)) {
        return i.followUp({content: "You're already in a Tribe!", ephemeral: true});
      }
      return memberCount;
    }));

    const minMemberCount = Math.min.apply(Math, membercounts);
    const randomTribe = roleids
      .map((roleid, i) => ({roleid: roleid, members: membercounts[i]})) //zip tribes and member counts
      .filter(({roleid, members}) => members === minMemberCount)    //find tribes with min members
      .sort(() => 0.5 - Math.random())[0].roleid;//sort randomly and get first tribe
    await i.member.roles.add(randomTribe);
    const tribes = JSON.parse(tribedataraw);
    const name = Object.entries(tribes).find(tribeInfo => tribeInfo[1].RoleID === randomTribe)[0];
    const message = `You've joined the ${name}!`;
    i.followUp({content: message, ephemeral:true});

  });
  collector.on("end", collected => console.log("collected tribe button"));
};
exports.commandData = {
  name: "setup",
  description: "Sends the Tribe Join Message",
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Bot Admin",
  guildOnly: true
};