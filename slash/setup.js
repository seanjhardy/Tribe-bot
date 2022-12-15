
const {
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Role,
} = require("discord.js");

const {
  ReadData,
  StoreTribe,
  SetLimit,
  GetTribeCooldown,
} = require("../modules/functions");
const wait = require("node:timers/promises").setTimeout;

exports.run = async (client, interaction) => {
  await interaction.reply({ content: "Successfully Created", ephemeral: true });
  const embed = new MessageEmbed()
    .setColor(0x0099ff)
    .setTitle("╣JOIN A TRIBE╠")
    .setDescription(
      "Build friendships, improve your leadership and compete to be the strongest of them all!\n\n" +
        "You will be randomly assigned a tribe of around 150 members, but **BEWARE**, tribe leaders and mods " +
        "have the power to __silence__ and __banish__ you from the tribe, and you will need to wait a week before being able to join another."
    )

    .setImage(
      "https://media.discordapp.net/attachments/1051261955882623008/1051878553899245638/tribes.png"
    );
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("JOIN TRIBE")
      .setStyle("PRIMARY")
      .setCustomId("TribeBut")
  );
  const channelid = interaction.channelId;
  await interaction.guild.channels.fetch(channelid).then(async (channelo) => {
    channelo.send({ embeds: [embed], components: [row] });
  });
  const filter = (i) => i.customId === "TribeBut";
  const collector = interaction.channel.createMessageComponentCollector({
    filter,
  });
  collector.on("collect", async (i) => {

    //i.user.id to get user id
    await i.deferUpdate();
    const tribedataraw = await ReadData();
    const tribedata = JSON.parse(tribedataraw);


    //Checks if user is in a cooldown from joining tribes
    let tribeCooldown = await GetTribeCooldown(i.user.id);
    if (tribeCooldown) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const releaseTime =
        tribeCooldown + parseInt(process.env.tribeCooldownTime);
      if (currentTimestamp < releaseTime) {
        const releaseTimeMinutes = Math.floor(
          (releaseTime - currentTimestamp) / 60
        );
        return i.followUp({
          content: `You're on a tribe cooldown for ${releaseTimeMinutes} more minutes`,
          ephemeral: true,
        });
      }
    }


    //Checks if user is banned from joining a tribe
    let userBanishArray = tribedata.banishes.filter(x => x.userID.includes(i.user.id));
    if (userBanishArray.length >= 3) {
      return i.followUp({
        content: `You are banned from joining tribes at this time!`,
        ephemeral: true,
      });
    }




    //Gets a headcount for every tribe
    const roleids = Object.entries(tribedata.tribes).map(
      ([key, value]) => value.RoleID
    );
    if (roleids.length === 0) {
      return i.followUp({
        content: "There are no tribes to Join!",
        ephemeral: true,
      });
    }
    const members = await i.guild.members.fetch();
    const roles = await i.guild.roles.fetch(); //updates cache
    const membercounts = await Promise.all(
      roleids.map(async (roleid) => {
        const role = await i.guild.roles.cache.get(roleid);
        const memberCount = role.members.size;

        const tribeOb = {
          id: role.id,
          name: role.name,
          memberCount: memberCount,
        };

        return tribeOb;
      })
    );

    //Gets all of the users roles
    const userRolesMap = i.member.roles.cache;
    const userRolesArray = Array.from(userRolesMap.keys());
    let currentTribe;
    //Checks each user role for a match in the tribe store
    userRolesArray.forEach((roleID, arrayIndex) => {
      membercounts.forEach((tribeObj, arrayIndex) => {
        if (roleID === tribeObj.id) currentTribe = tribeObj.name;
      });
    });

    //if the user is already in a tribe, return
    if (currentTribe) {
      return i.followUp({
        content: `You are already a member of ${currentTribe} tribe!`,
        ephemeral: true,
      });
    }

    //Filter tribes by lowest member count
    let lowestTribe = Number.POSITIVE_INFINITY;
    let highestTribe = Number.NEGATIVE_INFINITY;
    let tmp;
    for (let i = membercounts.length - 1; i >= 0; i--) {
      tmp = membercounts[i].memberCount;
      if (tmp < lowestTribe) lowestTribe = tmp;
      if (tmp > highestTribe) highestTribe = tmp;
    }

    //Gets the tribe(s) with the lowest member count
    let lowestTribeArray = membercounts.filter((tribe) => {
      return tribe.memberCount === lowestTribe;
    });

    //Assign tribe to user
    const randomTribeArrIndex = Math.floor(
      Math.random() * lowestTribeArray.length
    );
    const selectedTribe = lowestTribeArray[randomTribeArrIndex];
    await i.member.roles.add(selectedTribe.id);
    return i.followUp({
      content: `You've joined the ${selectedTribe.name} tribe!`,
      ephemeral: true,
    });
    //END OF COMMAND
  });
  collector.on("end", (collected) => {});
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
