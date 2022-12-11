const { Permissions } = require("discord.js");

const Enmap = require("enmap"); // Import Enmap
const tribes = new Enmap({ name: "tribes" }); // Create an instance of Enmap - Tribes

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  // CreateTribe Command
  const name = interaction.options.getString("name");
  const emoji = interaction.options.getString("emoji");

  if (tribes.has(name)) { // Check if tribes exists with name or emoji
    return interaction.reply(`Tribe name or emoji is already taken.`);
  } else {
    //create a role called name
    const role = await interaction.guild.roles.create({
        name: interaction.options.getString("name"),
    });

    const roleID = role.id;
    console.log(emoji);

    // if emoji is null, categoryName is name else categoryName is emoji + name
    if (emoji == null) {
      var categoryName = name;
    } else {
      var categoryName = emoji;
    }

    // Create Category and Channels.
    const category = await interaction.guild.channels.create(categoryName, {
      type: "GUILD_CATEGORY",
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
          id: roleID,
          allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
      ],
    });
    const announcements = await interaction.guild.channels.create("Announcements", {
      type: "GUILD_TEXT",
      parent: category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
          id: roleID,
          allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
          id: roleID,
          deny: [Permissions.FLAGS.SEND_MESSAGES],
        },
      ],
    });
    const general = await interaction.guild.channels.create("General", {
      type: "GUILD_TEXT",
      parent: category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
          id: roleID,
          allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
      ],
    });
    const vc1 = await interaction.guild.channels.create("VC 1", {
      type: "GUILD_VOICE",
      parent: category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        {
          id: roleID,
          allow: [Permissions.FLAGS.VIEW_CHANNEL],
        },
      ],
    });

    // Add to Enmap
    tribes.set(name, {
      name: name,
      emoji: emoji,
      roleID: roleID,
    });
    // Send message
    return interaction.reply(`Tribe "**${name}**" has been created.`);
  }
};

exports.commandData = {
  name: "createtribe",
  description: "Creates a new tribe",
  options: [

{
    name:"name",
    description:"the name of the tribe you want to create",
    type:3,
    required:true
},
{
    name:"emoji",
    description:"**OPTIONAL** the emoji of the tribe you want to create",
    type:3,
    required:false
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