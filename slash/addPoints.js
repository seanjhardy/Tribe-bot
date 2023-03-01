/* eslint-disable linebreak-style */
const { ReadData, StoreTribe } = require("../modules/functions");
require("dotenv").config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ephemeral:true});
  // JSON file
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);

  // Get the roles of executor.
  const executorRoles = interaction.member.roles.cache.map(r => r.name);

  // Check if executor has admin role.
  if (!executorRoles.includes("Tribe Chief")) {
    interaction.editReply({ content: "You do not have permission to do this.", ephemeral: true });
    return;
  }

  // Check if tribe exists in tribedata.
  console.log(tribedata)
  const tribe = interaction.options.get("tribe").value;
  if (!tribedata.tribes[tribe]) {
    interaction.editReply({ content: "This tribe does not exist.", ephemeral: true });
    return;
  }
};

exports.commandData = {
  name: "addpoints",
  description: "Add points to a tribe (Tribe Admin only).",
  options: [

    {
      name:"tribe",
      description:"Name of the tribe you want to add points to.",
      type:3,
      required:true
    },
    {
      name:"points",
      description:"How many points you want to add.",
      type:4,
      required:true
    }
  ],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Tribe Chief",
  guildOnly: true
};
//Tested