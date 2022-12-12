const { Permissions, Guild, ChannelManager } = require("discord.js");
const { ReadData } = require("../modules/functions.js");

exports.run = async (client, interaction) => {
  const tribeData = JSON.parse(await ReadData());
  const tribeNames = Object.keys(tribeData);
  let userTribe;
  let targetTribe;
  //Checks if command user is a tribe mod
  if (
    !interaction.member.roles.cache.find(
      (r) => r.id === process.env.TRIBEMODROLEID
    )
  ) {
    return await interaction.reply(
      `You do not have permission (Tribe Moderator) to use this command!`
    );
  }

  //Checks if target is a tribe mod
  const targetID = interaction.options.getUser("target").id;
  const target = interaction.guild.members.cache.get(targetID);
  if (target.roles.cache.has(process.env.TRIBEMODROLEID)) {
    return await interaction.reply(`Target user is a tribe moderator!`);
  }

  //Checks if target is a tribe chief
  if (target.roles.cache.has(process.env.TRIBECHIEFROLEID)) {
    return await interaction.reply(`Target user is a tribe chief!`);
  }

  //Gets all of the users roles
  const userRolesMap = interaction.member.roles.cache;
  const userRolesArray = Array.from(userRolesMap.keys());

  //Checks each user role for a match in the tribe store
  userRolesArray.forEach((roleID, arrayIndex) => {
    tribeNames.forEach((tribeName, arrayIndex) => {
     const tribeID = tribeData[tribeName].RoleID;

      if (roleID === tribeID) {
        userTribe = tribeID;
      }
    });
  });

  //Gets all of the targets roles
  const targetRolesMap = target.roles.cache;
  const targetRolesArray = Array.from(targetRolesMap.keys());

  //Checks each target role for a match in the tribe store
  targetRolesArray.forEach((roleID, arrayIndex) => {
    tribeNames.forEach((tribeName, arrayIndex) => {
      const tribeID = tribeData[tribeName].RoleID;

      if (roleID === tribeID) {
        targetTribe = tribeID;
      }
    });
  });


  
  if (userTribe === targetTribe) {
    const tribeRole = interaction.guild.roles.cache.get(targetTribe);
    target.roles.remove(tribeRole)
    return await interaction.reply(`User banished from tribe`);



  } else {
    return await interaction.reply(`You are not from the same tribe as your target`);
  }

  

};










exports.commandData = {
  name: "banish",
  description: "Banishes the target user from their tribe",
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
  permLevel: "Bot Admin",
  guildOnly: true,
};