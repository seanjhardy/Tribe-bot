const { Permissions, MessageEmbed, MessageActionRow, MessageButton, Role } = require("discord.js");

const { ReadData, StoreTribe, SetLimit } = require("../modules/functions");
const wait = require('node:timers/promises').setTimeout;
exports.run = async (client, interaction) =>
{
    const embed = new MessageEmbed()
        .setColor(0x0099FF)
        .setDescription("monologue about how tribes work here")
        .setThumbnail("https://media.discordapp.net/attachments/1051261955882623008/1051878553899245638/tribes.png");
    const row = new MessageActionRow()
        .addComponents(new MessageButton().setLabel('Join Tribe').setStyle('PRIMARY').setCustomId("TribeBut"));
    const channelid = interaction.channelId;
    await interaction.guild.channels.fetch(channelid).then(async channelo => {
        channelo.send({embeds: [embed], components: [row]})
    })
    const filter = i => i.customId === 'TribeBut';
    const collector = interaction.channel.createMessageComponentCollector({filter});
    collector.on('collect', async i =>{
        //i.user.id to get user id
        await i.deferUpdate();
        const tribedataraw = await ReadData();
        const tribedata = JSON.parse(tribedataraw);
        const roleids = [];
        for (const [key, value] of Object.entries(tribedata))
        {
            if (roleids[0] !== undefined)
            {
                roleids.push(value.RoleID);
            }
            else
            {
                roleids[0] = value.RoleID;
            }
        }
        console.log(roleids)
        if (roleids[0] === undefined)
        {
            return i.followUp({content: "There is no Tribes to Join!", ephemeral: true})
        }
        const membercounts = [];
        roleids.forEach(async roleid => {
            let role = await i.guild.roles.fetch(roleid)
            membercounts.push(parseInt(role.members.size));
            if (await i.member.roles.cache.has(roleid) === true)
            {
                return i.followUp({content: "You're already in a Tribe!", ephemeral: true});
            }
        
        });
        await wait(100); // give it time to add to array
        const allEqual = arr => arr.every( v => v === arr[0] )
        if (allEqual(membercounts))
        {
            console.log("they are all equal");
            const random = roleids[Math.floor(Math.random() * roleids.length)];
            await i.member.roles.add(random);
        }
        else
        {
            console.log("they are not all equal");
            const smallest = Math.min(...membercounts);
            console.log(smallest);
            const index = membercounts.indexOf(smallest);
            await i.member.roles.add(roleids[index]);
        }
    })
    collector.on('end', collected => console.log("collected tribe button"));
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