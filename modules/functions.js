const logger = require("./logger.js");
const config = require("../config.js");
const { settings } = require("./settings.js");
const fs = require("fs");
// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.


/*
  PERMISSION LEVEL FUNCTION
  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!
  */
function permlevel(message) {
  let permlvl = 0;

  const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

  while (permOrder.length) {
    const currentLevel = permOrder.shift();
    if (message.guild && currentLevel.guildOnly) continue;
    if (currentLevel.check(message)) {
      permlvl = currentLevel.level;
      break;
    }
  }
  return permlvl;
}

/*
  GUILD SETTINGS FUNCTION
  This function merges the default settings (from config.defaultSettings) with any
  guild override you might have for particular guild. If no overrides are present,
  the default settings are used.
*/
  
// getSettings merges the client defaults with the guild settings. guild settings in
// enmap should only have *unique* overrides that are different from defaults.
function getSettings(guild) {
  settings.ensure("default", config.defaultSettings);
  if (!guild) return settings.get("default");
  const guildConf = settings.get(guild.id) || {};
  // This "..." thing is the "Spread Operator". It's awesome!
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  return ({...settings.get("default"), ...guildConf});
}

/*
  SINGLE-LINE AWAIT MESSAGE
  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...
  USAGE
  const response = await awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);
*/
async function awaitReply(msg, question, limit = 60000) {
  const filter = m => m.author.id === msg.author.id;
  await msg.channel.send(question);
  try {
    const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
    return collected.first().content;
  } catch (e) {
    return false;
  }
}


/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */
  
// toProperCase(String) returns a proper-cased string such as: 
// toProperCase("Mary had a little lamb") returns "Mary Had A Little Lamb"
function toProperCase(string) {
  return string.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  logger.error(`Uncaught Exception: ${errorMsg}`);
  console.error(err);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  process.exit(1);
});

process.on("unhandledRejection", err => {
  logger.error(`Unhandled rejection: ${err}`);
  console.error(err);
});

/* Storage System Check */
async function FileSysCheck()
{
  if (!fs.existsSync('./data/Data.json'))
  {
    console.log("FS: Could not read DATA! Attempting to Create DATA...");
    await fs.writeFileSync("./data/Data.json", `{"banishes":{},"tribes":{}, "cooldown":{}, "limit":-1}`, async (err, result) =>
    {
      if (err)
      {
        console.error("FS: Failed to create DATA! Did you check your file permissions?");
        process.abort();
      }
      
    })
    SetLimit(-1);
  }

}
async function ReadData() {
  await FileSysCheck();
  
  return fs.readFileSync('./data/Data.json', 'utf8', async (err, data) =>
  {
    if (err)
    {
      console.log("FS: Error Reading!");
    }

    return data;
    
  })

}

async function WriteData(datatowrite)
{
  await FileSysCheck();
  fs.writeFile('./data/Data.json', datatowrite, (err, result) => {
    if (err)
    {
      console.log("FS: Write Error!");
    }
  });
}

async function StoreTribe(Name, Emoji, Category, RoleID)
{
  var togethernow = {Emoji, Category, RoleID, Points: 0};
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);
  tribedata.tribes[Name] = togethernow;
  await WriteData(JSON.stringify(tribedata));
}
async function RemoveTribe(Name)
{
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);
  var tribe = tribedata.tribes[Name]
  delete tribedata.tribes[Name];
  await WriteData(JSON.stringify(tribedata));
}

async function SetLimit(int)
{
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);
  tribedata.limit = int
  await WriteData(JSON.stringify(tribedata))
}


async function SetTribeCooldown(userID, timestamp, tribeID)
{
  let banishObject = {banishTime: timestamp, userID: userID, tribeID: tribeID}
  let cooldownObject = {banishTime: timestamp}
  let tribeDataRaw = await ReadData();
  let tribedata = JSON.parse(tribeDataRaw);
  tribedata.banishes.push(banishObject)
  tribedata.cooldown[userID] = cooldownObject;
  await WriteData(JSON.stringify(tribedata));
  return 
}

async function GetTribeCooldown(userID)
{
 try {
   let tribeDataRaw = await ReadData();
   let tribedata = JSON.parse(tribeDataRaw);
   let releaseDate = tribedata.cooldown[userID].banishTime
   return releaseDate
 } catch (error){
   return null
 }
 
 
}

async function removeBanishes(targetID)
{
 try {
   let tribeDataRaw = await ReadData();
   let tribedata = JSON.parse(tribeDataRaw);
   let banishArray = tribedata.banishes
   let newBanishArray = banishArray.filter(function( obj ) {
    return obj.userID !== targetID;
   });
   tribedata.banishes = newBanishArray
   await WriteData(JSON.stringify(tribedata));
   return 
 } catch (error){
  return null
 }
 
 
}



async function AddPoints(Name, amount)
{
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);
  var tribe = tribedata[Name]
  tribe.Points += amount;
  await WriteData(JSON.stringify(tribedata));
}
async function MinusPoints(Name, amount)
{
  var tribedataraw = await ReadData();
  var tribedata = JSON.parse(tribedataraw);
  var tribe = tribedata[Name]
  tribe.Points -= amount;
  await WriteData(JSON.stringify(tribedata));
}

module.exports = { getSettings, permlevel, awaitReply, toProperCase, ReadData, WriteData, StoreTribe, RemoveTribe, SetLimit, AddPoints, MinusPoints, SetTribeCooldown, GetTribeCooldown, removeBanishes };

