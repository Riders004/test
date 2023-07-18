process.on("uncaughtException", console.error);
require("./config");

const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const axios = require('axios');
const { exec } = require("child_process");
const moment = require("moment-timezone");
const { EmojiAPI } = require("emoji-api");
const { addBalance } = require("./lib/limit.js");
const { smsg, formatp, tanggal, GIFBufferToVideoBuffer, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom } = require('./lib/myfunc')
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const _ = require("lodash");
const yargs = require("yargs/yargs");
var low;
try {
  low = require("lowdb");
} catch (e) {
  low = require("./lib/lowdb");
}

const { Low, JSONFile } = low;
const mongoDB = require("./lib/mongoDB");

global.opts = new Object(
  yargs(process.argv.slice(2)).exitProcess(false).parse()
);
global.db = new Low(
  /https?:\/\//.test(opts["db"] || "")
    ? new cloudDBAdapter(opts["db"])
    : /mongodb/.test(opts["db"])
      ? new mongoDB(opts["db"])
      : new JSONFile(`src/database.json`)
);
global.DATABASE = global.db; // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(function() {
        !global.db.READ
          ? (clearInterval(this),
            resolve(
              global.db.data == null ? global.loadDatabase() : global.db.data
            ))
          : null;
      }, 1 * 1000)
    );
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {}),
  };
  global.db.chain = _.chain(global.db.data);
};
loadDatabase();
global.db = JSON.parse(fs.readFileSync("./src/database.json"));
if (global.db)
  global.db = {
    sticker: {},
    database: {},
    game: {},
    others: {},
    users: {},
    ...(global.db || {}),
  };

let banUser = JSON.parse(fs.readFileSync('./database/banUser.json'));
let banchat = JSON.parse(fs.readFileSync('./database/banChat.json'));


let _limit = JSON.parse(fs.readFileSync('./storage/user/limit.json'));
let _buruan = JSON.parse(fs.readFileSync('./storage/user/bounty.json'));
let _darahOrg = JSON.parse(fs.readFileSync('./storage/user/blood.json'))

let pendaftar = JSON.parse(fs.readFileSync('./storage/user/user.json'))
let balance = JSON.parse(fs.readFileSync('./database/balance.json'))
let ssewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
let ban = JSON.parse(fs.readFileSync('./database/ban.json'))
let autosticker = JSON.parse(fs.readFileSync('./database/autosticker.json'))
const _autostick = JSON.parse(fs.readFileSync('./database/autostickpc.json'))
let _leveling = JSON.parse(fs.readFileSync('./database/leveling.json'))
let _level = JSON.parse(fs.readFileSync('./database/level.json'))
let limit = JSON.parse(fs.readFileSync('./database/limit.json'))
let setik = JSON.parse(fs.readFileSync('./src/sticker.json'))
let vien = JSON.parse(fs.readFileSync('./src/audio.json'))
let imagi = JSON.parse(fs.readFileSync('./src/image.json'))
let videox = JSON.parse(fs.readFileSync('./src/video.json'))
global.db = JSON.parse(fs.readFileSync('./src/database.json'))
let _sewa = require("./lib/sewa");
const sewa = JSON.parse(fs.readFileSync('./database/sewa.json'))


const time = moment.tz('Asia/Kolkata').format('DD/MM HH:mm:ss')
const ucap = moment(Date.now()).tz('Asia/Kolkata').locale('id').format('a')
var buln = ['/01/', '/02/', '/03/', '/04/', '/05/', '/06/', '/07/', '/08/', '/09/', '/10/', '/11/', '/12/'];
var myHari = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var tgel = new Date();
var hri = tgel.getDate();
var bulnh = tgel.getMonth();
var thisHari = tgel.getDay(),
  thisDaye = myHari[thisHari];
var yye = tgel.getYear();
var syear = (yye < 1000) ? yye + 1900 : yye;
const jangwak = (hri + '' + buln[bulnh] + '' + syear)
const janghar = (thisDaye)
var myHari = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var tgel = new Date();
var thisHari = tgel.getDay(),
  thisDaye = myHari[thisHari];
var yye = tgel.getYear();

module.exports = Maria = async (Maria, m, chatUpdate, store) => {
  try {
    var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
    var budy = (typeof m.text == 'string' ? m.text : '')
    const prefix = global.prefa
    const packname = global.packname
    const mariapic = global.thum
    const isCmd = body.startsWith(prefix)
    const notCmd = body.startsWith('')
    const command = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const pushname = m.pushName || "No Name"
    const botNumber = await Maria.decodeJid(Maria.user.id)
    const isCreator = [botNumber, ...global.Owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    const itsMe = m.sender == botNumber ? true : false
    const text = args.join(" ")
    const from = m.chat
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase()
    const groupMetadata = m.isGroup ? await Maria.groupMetadata(m.chat).catch(e => { }) : ''
    const groupName = m.isGroup ? groupMetadata.subject : ''
    const participants = m.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
    const groupOwner = m.isGroup ? groupMetadata.owner : ''
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const isUser = pendaftar.includes(m.sender)
    const isBan = banUser.includes(m.sender)
    const isBanChat = m.isGroup ? banchat.includes(from) : false
    const isRakyat = isCreator || global.rkyt.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false
    const AntiLink = m.isGroup ? ntilink.includes(from) : false
    const AntiLinkYoutubeVid = m.isGroup ? ntilinkytvid.includes(from) : false
    const AntiLinkYoutubeChannel = m.isGroup ? ntilinkytch.includes(from) : false
    const AntiLinkInstagram = m.isGroup ? ntilinkig.includes(from) : false
    const AntiLinkFacebook = m.isGroup ? ntilinkfb.includes(from) : false
    const AntiLinkTiktok = m.isGroup ? ntilinktt.includes(from) : false
    const AntiLinkTelegram = m.isGroup ? ntilinktg.includes(from) : false
    const AntiLinkTwitter = m.isGroup ? ntilinktwt.includes(from) : false
    const AntiLinkAll = m.isGroup ? ntilinkall.includes(from) : false
    const antiWame = m.isGroup ? ntwame.includes(from) : false
    const antiVirtex = m.isGroup ? ntvirtex.includes(from) : false
    const AntiNsfw = m.isGroup ? ntnsfw.includes(from) : false
    const isLeveling = m.isGroup ? _leveling.includes(from) : false
    autoreadsw = true
    const content = JSON.stringify(m.message)
    const q = args.join(' ')

    const isQuotedVideo = m.mtype === 'extendedTextMessage' && content.includes('videoMessage')
    const isQuotedAudio = m.mtype === 'extendedTextMessage' && content.includes('audioMessage')
  

    autoreadsw = true;
    _sewa.expiredCheck(Maria, sewa);

    const reply = (teks) => {
            Maria.sendMessage(m.chat, { text: teks},{ quoted: m})
        }
        
        const replay = (teks) => {
            Maria.sendMessage(m.chat, { text: teks}, { quoted: m})
        }


    /* const replay = (teks) => {
      Maria.sendMessage(m.chat, { text: teks }, { quoted: m }); 
    }; */
    const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
    const senderNumber = sender.split('@')[0]

    function randomNomor(angka) {
      return Math.floor(Math.random() * angka) + 1;
    }

    if (m.message) {
      addBalance(m.sender, randomNomor(574), balance);
      console.log(
        chalk.black(chalk.bgWhite("[ MESSAGE ]")),
        chalk.black(chalk.bgGreen(new Date())),
        chalk.black(chalk.bgBlue(budy || m.mtype)) +
        "\n" +
        chalk.magenta("=> From"),
        chalk.green(pushname),
        chalk.yellow(m.sender) + "\n" + chalk.blueBright("=> In"),
        chalk.green(m.isGroup ? pushname : "Private Chat", m.chat)
      );
    }

    if (isCmd && !isUser) {
      pendaftar.push(m.sender);
      fs.writeFileSync("./storage/user/user.json", JSON.stringify(pendaftar));
    }

    if (global.autoreadpmngc) {
      if (command) {
        await Maria.sendPresenceUpdate("composing", m.chat);
        Maria.sendReadReceipt(from, m.sender, [m.key.id]);
      }
    }
    /*
  if (global.autoReadGc) {
  if (m.isGroup) { Maria.sendReadReceipt(m.chat, m.sender, [m.key.id]) }
}
*/

    if (global.autoReadAll) {
      if (m.chat) {
        Maria.sendReadReceipt(m.chat, m.sender, [m.key.id]);
      }
    }

    if (global.autoRecord) {
      if (m.chat) {
        Maria.sendPresenceUpdate("recording", m.chat);
      }
    }

    if (global.autoTyping) {
      if (m.chat) {
        Maria.sendPresenceUpdate("composing", m.chat);
      }
    }

    if (global.available) {
      if (m.chat) {
        Maria.sendPresenceUpdate("available", m.chat);
      }
    }

    const hariRaya = new Date("6 1, 2022 00:00:00");
    const sekarang = new Date().getTime();
    const Selisih = hariRaya - sekarang;
    const jhari = Math.floor(Selisih / (1000 * 60 * 60 * 24));
    const jjam = Math.floor(
      (Selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const mmmenit = Math.floor((Selisih % (1000 * 60 * 60)) / (1000 * 60));
    const ddetik = Math.floor((Selisih % (1000 * 60)) / 1000);
    const ultah = `${jhari}Day ${jjam}Hour ${mmmenit}Minute ${ddetik}Second`;

    async function hitungmundur(bulan, tanggal) {
      let from = new Date(`${bulan} ${tanggal}, 2022 00:00:00`).getTime();
      let now = Date.now();
      let distance = from - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      return (
        days +
        "Day " +
        hours +
        "Hour " +
        minutes +
        "Minute " +
        seconds +
        "Second"
      );
    }

    if (AntiLinkAll)
      var rondonxk = '[-a-zA-Z0-9@:%._+~#=].[-a-zA-Z0-9@:%._+~#=].[-a-zA-Z0-9()@:%_+.~#?&/=]'
      if (budy.includes("https://")) {
        if (!isBotAdmins) return
        bvl = `\`\`\`「  Antilink System  」\`\`\`\n\nLink sent by Admin so no action will be taken!`
        if (isAdmins) return reply(bvl)
        if (m.key.fromMe) return reply(bvl)
        if (isCreator) return reply(bvl)
        kice = m.sender
        await Maria.sendMessage(
          from,
          {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: m.id,
              participant: m.sender,
            },
          },
          {
            quoted: m,
          }
        );
      //  await Maria.groupParticipantsUpdate(m.chat, [kice], 'remove')
        Maria.sendMessage(from, { text: `\`\`\`「  Antilink System  」\`\`\`\n\n*⚠️ Group link detected !*\n\n*🚫@${kice.split("@")[0]} You are not allowed to send any links in this group !*\n`, contextInfo: { mentionedJid: [kice] } }, { quoted: m })
      } else {
      }

    if (budy.includes("http://")) {
        if (!isBotAdmins) return
        bvl = `\`\`\`「  Antilink System  」\`\`\`\n\nLink sent by Admin so no action will be taken!`
        if (isAdmins) return reply(bvl)
        if (m.key.fromMe) return reply(bvl)
        if (isCreator) return reply(bvl)
        kice = m.sender
        await Maria.sendMessage(
          from,
          {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: m.id,
              participant: m.sender,
            },
          },
          {
            quoted: m,
          }
        );
      //  await Maria.groupParticipantsUpdate(m.chat, [kice], 'remove')
        Maria.sendMessage(from, { text: `\`\`\`「  Antilink System  」\`\`\`\n\n*⚠️ Group link detected !*\n\n*🚫@${kice.split("@")[0]} You are not allowed to send any links in this group !*\n`, contextInfo: { mentionedJid: [kice] } }, { quoted: m })
      } else {
      }

    switch (command) {
////////////////////////////////////////////////////
      //General commands
      case "Maria": case "Maria-Md":
      const mariain= `⚡ *Maria-Md* ⚡\n\n🍀 *Description: A WhatsApp Bot With Rich NSFW features based on zero-two.*\n\n🌐 *OFFICIAL BOT URL: https://github.com/Ayush-pandey-u* \n\n 📒 *Guide: https://github.com/Ayush-pandey-u* \n\n 👾 *BOT URL:https://github.com/Ayush-pandey-u* \n`
      Maria.sendMessage(from, { video: { url: 'https://media.tenor.com/videos/80f557139bc3a0857f6a705da6990fdc/mp4' }, gifPlayback: true, caption: mariain }, { quoted: m })

        break
      
      case "rules":
        const helptxt = `_*📍[Rules for Maria Md usage]📍*_\n\n\n*>>>* use -support to get the Official group link in your dm.\n\n*--->* If you want to add Maria-Md in your group the contact the owner by *-owner/-mods* \n\n*--->* Dont use wrong command, use the command given in the *-help* list \n\n* Dont spam the bot with commands if Maria-Md is not responding, its means the maybe owner is offline or facing internet issue. \n\n* Dont Dm the bot \n\n*IF YOU DONT FOLLOW THE RULES THEN YOU WILL BE BANNED* 🚫 \n\n\n*©️ Ayush Bots inc* `

        Maria.sendMessage(from, { video: { url: 'https://c.tenor.com/geMdtLCXZkAAAAPo/rules.mp4' }, gifPlayback: true, caption: helptxt }, { quoted: m })

        break
      case 'hii': case 'hi': case 'Hi':
        let txxt = `👋🏻 Hi *${pushname}*, i am  *Maria-Md*📍. A whatsapp bot created by: Ayush and based on Maria  bot: FantoX001. I don't have time for chit-chat Darling. Use command from *${prefix}help* list if you want me to do anything.`

        Maria.sendMessage(m.chat, { video: { url: `https://c.tenor.com/4TLYvKWI2mgAAAPo/nakano-yotsuba-smile.mp4` }, caption: txxt, gifPlayback: true }, { quoted: m });
        break
      case "support":

        let tex = `📍My Developer's Group📍\n\n*🎇 𝐌𝐚𝐫𝐢𝐚 support group:🎇* *https://chat.whatsapp.com/FoS7pSPtfMqBuoireK4aAJ*`

        await Maria.sendMessage(m.sender, { text: `${tex}` },);

        await Maria.sendMessage(m.chat, { video: { url: `https://i.makeagif.com/media/3-25-2023/NO05ia.mp4` }, caption: 'I sent you the support Link in personal message.\n Pls check.', gifPlayback: true }, { quoted: m });
        break

      case "info":
      let anu = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)
        let ifx = `🌟『𝕄𝕒𝕣𝕚𝕒-𝕄𝕕 』🌟
*🌟Description:* A WhatsApp Bot With Rich NSFW features based on zero-two
*⚡Speed:*
*🚦Uptime:* ${runtime(process.uptime())}
*🕸Version:* 1.0.0
*🔖listgc:* ${anu.length}
*👤Owner:*  ${global.Owner}

*Powered by Ayush*`
Maria.sendMessage(m.chat, { video: { url: `https://media.tenor.com/VmwZnGeD0oEAAAPo/maria-naruse-shinmai-maou-no-testament.mp4` }, caption: ifx, gifPlayback: true }, { quoted: m });
        break
case 'listgc': {
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 let anu = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)
 let teks = ` 「  Maria 's group user list  」\n\nTotal ${anu.length} users are using bot in Groups.`
 for (let i of anu) {
  let metadata = await Maria .groupMetadata(i)
  if (metadata.owner === "undefined") {
  loldd = false
  } else {
  loldd = metadata.owner
  }
  teks += `\n\nName : ${metadata.subject ? metadata.subject : "undefined"}\nOwner : ${loldd ? '@' + loldd.split("@")[0] : "undefined"}\nID : ${metadata.id ? metadata.id : "undefined"}\nMade : ${metadata.creation ? moment(metadata.creation * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss') : "undefined"}\nMember : ${metadata.participants.length ? metadata.participants.length : "undefined"}`
 }
 Maria .sendTextWithMentions(m.chat, teks, m)
 }
 break

        
        
         

      case 'owner': case 'creator': case 'mod': case 'mods': {
      if (!m.isGroup) return replay(mess.pm)
        Maria.sendContact(m.chat, global.Owner, m)
      }

        break
      
 ///////////////////////////////////////////////////
 //Group menu
      case 'antilink': {
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isBotAdmins) return replay(mess.botadmin)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
 if (args[0] === "on") {
 if (AntiLinkAll) return replay('Already activated')
 ntilinkall.push(from)
 replay('Enabled all antilink !')
 var groupe = await Maria.groupMetadata(from)
 var members = groupe['participants']
 var mems = []
 members.map(async adm => {
 mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
 })
 Maria.sendMessage(from, {text: `\`\`\`「 Warning 」\`\`\`\n\nAntilink System Activated!`, contextInfo: { mentionedJid : mems }}, {quoted:m})
 } else if (args[0] === "off") {
 if (!AntiLinkAll) return replay('Already deactivated')
 let off = ntilinkall.indexOf(from)
 ntilinkall.splice(off, 1)
 replay('Disabled all antilink !')
 } else {
   let textmsg = `❗️command:- *${command}*
   🍁description:- Type -antilink on to turn on antilink feature or Type -antilink off to turn off antilink feature.
  🔖Example:- ${prefix}${command} on` 
     await Maria.sendMessage(m.chat, { text: `${textmsg}`}, `${global.BotName}`, m)
   }
   }
    
   break
   
case 'remove': case 'kick':{

        if (!m.isGroup) return replay(mess.grouponly)
        if (!isBotAdmins) return replay(mess.botadmin)
        if (!isAdmins && !isCreator) return replay(mess.useradmin)
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await Maria.groupParticipantsUpdate(m.chat, [users], 'remove')
      }
        break
        
      case 'add': {
		if (!m.isGroup) throw mess.group
                if (!isBotAdmins) throw mess.botAdmin
                if (!isAdmins) throw mess.admin
		let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await Maria.groupParticipantsUpdate(m.chat, [users], 'add').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
	break
        
        case 'resetlinkgc':
    case 'resetlinkgroup':
    case 'resetlinkgrup':
    case 'revoke':
    case 'resetlink':
    case 'resetgrouplink':
    case 'resetgclink':
    case 'resetgruplink': {
       if (isBan) return reply(mess.banned)	 			
    if (isBanChat) return reply(mess.bangc)
    if (!m.isGroup) return replay(mess.grouponly)
    if (!isBotAdmins) return replay(mess.botadmin)
    if (!isAdmins && !isCreator) return replay(mess.useradmin)
    Maria.groupRevokeInvite(m.chat)
    }
    break
    
    case "gclink":
      case "grouplink":
        {
          if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isBotAdmins) return replay(mess.botadmin)
          let response = await Maria.groupInviteCode(m.chat);
          Maria.sendText(
            m.sender,
            `https://chat.whatsapp.com/${response}\n\nGroup Link📍: ${groupMetadata.subject}`,
            m,
            { detectLink: true }
          );
        }
        await Maria.sendMessage(m.chat, { video: { url: `https://media.tenor.com/hzWYhzhMTeEAAAPo/maria-useless.mp4` }, caption: 'I sent you the Group Link in personal message.\n Pls check.', gifPlayback: true }, { quoted: m });
        break
        
case 'listonline': case 'here':{
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
if (!isCreator) return replay(mess.botowner);
	
 let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
 let online = [...Object.keys(store.presences[id]), botNumber]
 let liston = 1
 Maria.sendText(m.chat, '  「 *Now Online Members* 」\n\n' + online.map(v => `${liston++} . @` + v.replace(/@.+/, '')).join`\n`, m, { mentions: online })
 }
 break
 
 case 'tag': case 'tagall': case 'all':{
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
 let teks = `🧩𝗧𝗮𝗴𝗮𝗹𝗹🧩
  
 *Message : ${args.join(" ") ? args.join(" ") : 'no message'}*\n\n`
 for (let mem of participants) {
 teks += `🍭 @${mem.id.split('@')[0]}\n`
 }
 Maria.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m })
 }
 break
 case'admin': case 'tagadmin':{
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!text) return replay(`*Please quote or write a meaningful message to tag admins to*`)
 let teks = `*🧩𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗺𝗶𝗻𝘀🧩*
  
 *Message : ${text}*\n\n`
 for (let mem of groupAdmins) {
 teks += `🤴 @${mem.split('@')[0]}\n`
 }
 Maria.sendMessage(m.chat, { text: teks, mentions: groupAdmins}, { quoted: m })
 }
 break
 
case 'hidetag': {
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
 Maria.sendMessage(m.chat, { text : args.join(" ") ? args.join(" ") : '' , mentions: participants.map(a => a.id)}, { quoted: m })
 }
 break
 
 case 'promote': {
        if (isBan) return reply(mess.banned)	 			
     if (isBanChat) return reply(mess.bangc)
     if (!m.isGroup) return replay(mess.grouponly)
     if (!isBotAdmins) return replay(mess.botadmin)
     if (!isAdmins && !isCreator) return replay(mess.useradmin)
     let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
     await Maria.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => replay(mess.promote)).catch((err) => replay(jsonformat(err)))
     }
     break

     case 'demote': {
        if (isBan) return reply(mess.banned)	 			
     if (isBanChat) return reply(mess.bangc)
     if (!m.isGroup) return replay(mess.grouponly)
     if (!isBotAdmins) return replay(mess.botadmin)
     if (!isAdmins && !isCreator) return replay(mess.useradmin)
     let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
     await Maria.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => replay(jsonformat(res))).catch((err) => replay(jsonformat(err)))
     }
     break
     
     case 'setname': case 'setsubject': {
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isBotAdmins) return replay(mess.botadmin)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
 if (!text) return replay('Pls enter -setname <New Group Name>  to change this Group Name')
 await Maria.groupUpdateSubject(m.chat, text).then((res) => replay(mess.jobdone)).catch((err) => replay(jsonformat(err)))
 }
 break
////////////////////////////////////////////////////
      //////search menu

      case 'weather':

        if (!args[0]) return reply("Enter your location to search weather.")
        myweather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args.join(" ")}&units=metric&appid=e409825a497a0c894d2dd975542234b0&language=tr`)

        const weathertext = `           🌤 *Weather Report* 🌤  \n\n🔎 *Search Location:* ${myweather.data.name}\n*💮 Country:* ${myweather.data.sys.country}\n🌈 *Weather:* ${myweather.data.weather[0].description}\n🌡️ *Temperature:* ${myweather.data.main.temp}°C\n❄️ *Minimum Temperature:* ${myweather.data.main.temp_min}°C\n📛 *Maximum Temperature:* ${myweather.data.main.temp_max}°C\n💦 *Humidity:* ${myweather.data.main.humidity}%\n🎐 *Wind:* ${myweather.data.wind.speed} km/h\n`
        Maria.sendMessage(from, { video: { url: 'https://media.tenor.com/bC57J4v11UcAAAPo/weather-sunny.mp4' }, gifPlayback: true, caption: weathertext }, { quoted: m })

        break


case "coffee":
  if (isBan) return reply(mess.banned);
  if (isBanChat) return reply(mess.bangc);
  waifudhgd = await getBuffer(`https://coffee.alexflipnote.dev/random`);

          let nsfwapimess = {
            image: waifudhgd,
            caption: `Here it is...`,
          };
          await Maria.sendMessage(m.chat, nsfwapimess, {
            quoted: m,
          }).catch((err) => {
            return "Error!";
          });
        break
 ///////////////////////////////////////////////////
     //funmenu
     case 'handsomecheck':
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
	
				if (!text) return replay(`Tag Someone, Example : ${prefix + command} @Maria`)
					const gan = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
					const teng = gan[Math.floor(Math.random() * gan.length)]
Maria.sendMessage(from, { text: `*${command}*\n\nName : ${q}\nAnswer : *${teng}%*` }, { quoted: m })
					break
					
					case 'beautifulcheck':
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
				if (!text) return replay(`Tag Someone, Example : ${prefix + command} @Maria`)
					const can = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
					const tik = can[Math.floor(Math.random() * can.length)]
Maria.sendMessage(from, { text: `*${command}*\n\nName : ${q}\nAnswer : *${tik}%*` }, { quoted: m })
					break
case 'ship':
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
				if (!text) return replay(`Tag Someone, Example : ${prefix + command} @maria`)
					const sip = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
					const shik = sip[Math.floor(Math.random() * sip.length)]
Maria.sendMessage(from, { video: { url: `https://media.tenor.com/VmwZnGeD0oEAAAPo/maria-naruse-shinmai-maou-no-testament.mp4` },caption: `*🍁matching🍁*\n\n ${pushname+q}\nAnswer : *${shik}%*`,gifPlayback: true}, { quoted: m })
					break

 case 'dare':
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
	Maria.sendMessage(from, { react: { text: "ðŸŒ" , key: m.key }})
	
                   const dare =[
"eat 2 tablespoons of rice without any side dishes, if it's dragging you can drink",
         "spill people who make you pause",
         "call crush/pickle now and send ss",
         "drop only emote every time you type on gc/pc for 1 day.",
         "say Welcome to Who Wants To Be a Millionaire! to all the groups you have",
         "call ex saying miss",
         "sing the chorus of the last song you played",
         "vn your ex/crush/girlfriend, says hi (name), wants to call, just a moment. I miss🥺👉🏼👈🏼",
         "Bang on the table (which is at home) until you get scolded for being noisy",
         "Tell random people - I was just told I was your twin first, we separated, then I had plastic surgery. And this is the most ciyusss_ thing",
         "mention ex's name",
         "make 1 rhyme for the members!",
         "send ur whatsapp chat list",
         "chat random people with gheto language then ss here",
         "tell your own version of embarrassing things",
         "tag the person you hate",
         "Pretending to be possessed, for example: possessed by dog, possessed by grasshoppers, possessed by refrigerator, etc.",
         "change name to *I AM DONKEY* for 24 hours",
         "shout *ma chuda ma chuda ma chuda* in front of your house",
         "snap/post boyfriend photo/crush",
         "tell me your boyfriend type!",
         "say *i hv crush on you, do you want to be my girlfriend?* to the opposite sex, the last time you chatted (submit on wa/tele), wait for him to reply, if you have, drop here",
         "record ur voice that read *titar ke age do titar, titar ke piche do titar*",
         "prank chat ex and say *i love u, please come back.* without saying dare!",
         "chat to contact wa in the order according to your battery %, then tell him *i am lucky to hv you!*",
         "change the name to *I am a child of randi* for 5 hours",
         "type in bengali 24 hours",
         "Use selmon bhoi photo for 3 days",
         "drop a song quote then tag a suitable member for that quote",
         "send voice note saying can i call u baby?",
         "ss recent call whatsapp",
         "Say *YOU ARE SO BEAUTIFUL DON'T LIE* to guys!",
         "pop to a group member, and say fuck you",
         "Act like a chicken in front of ur parents",
         "Pick up a random book and read one page out loud in vn n send it here",
         "Open your front door and howl like a wolf for 10 seconds",
         "Take an embarrassing selfie and paste it on your profile picture",
         "Let the group choose a word and a well known song. You have to sing that song and send it in voice note",
         "Walk on your elbows and knees for as long as you can",
         "sing national anthem in voice note",
         "Breakdance for 30 seconds in the sitting room😂",
         "Tell the saddest story you know",
         "make a twerk dance video and put it on status for 5mins",
         "Eat a raw piece of garlic",
         "Show the last five people you texted and what the messages said",
         "put your full name on status for 5hrs",
         "make a short dance video without any filter just with a music and put it on ur status for 5hrs",
         "call ur bestie, bitch",
         "put your photo without filter on ur status for 10mins",
         "say i love oli london in voice note🤣🤣",
         "Send a message to your ex and say I still like you",
         "call Crush/girlfriend/bestie now and screenshot here",
         "pop to one of the group member personal chat and Say you ugly bustard",
         "say YOU ARE BEAUTIFUL/HANDSOME to one of person who is in top of ur pinlist or the first person on ur chatlist",
         "send voice notes and say, can i call u baby, if u r boy tag girl/if girl tag boy",
         "write i love you (random grup member name, who is online) in personal chat, (if u r boy write girl name/if girl write boy name) take a snap of the pic and send it here",
         "use any bollywood actor photo as ur pfp for 3 days",
         "put your crush photo on status with caption, this is my crush",
         "change name to I AM GAY for 5 hours",
         "chat to any contact in whatsapp and say i will be ur bf/gf for 5hours",
         "send voice note says i hv crush on you, want to be my girlfriend/boyfriend or not? to any random person from the grup(if u girl choose boy, if boy choose girl",
         "slap ur butt hardly send the sound of slap through voice note😂",
         "state ur gf/bf type and send the photo here with caption, ugliest girl/boy in the world",
         "shout bravooooooooo and send here through voice note",
         "snap your face then send it here",
         "Send your photo with a caption, i am lesbian",
         "shout using harsh words and send it here through vn",
         "shout you bastard in front of your mom/papa",
         "change the name to i am idiot for 24 hours",
         "slap urself firmly and send the sound of slap through voice note😂",
         "say i love the bot owner Kai through voice note",
         "send your gf/bf pic here",
         "make any tiktok dance challenge video and put it on status, u can delete it after 5hrs",
         "breakup with your best friend for 5hrs without telling him/her that its a dare",
          "tell one of your frnd that u love him/her and wanna marry him/her, without telling him/her that its a dare",
          "say i love depak kalal through voice note",
          "write i am feeling horny and put it on status, u can delete it only after 5hrs",
          "write i am lesbian and put it on status, u can delete only after 5hrs",
          "kiss your mommy or papa and say i love you😌",
          "put your father name on status for 5hrs",
          "send abusive words in any grup, excepting this grup, and send screenshot proof here"
     ]
                   const Mariadareww = dare[Math.floor(Math.random() * dare.length)]
                   buffer = await getBuffer(`https://graph.org/file/8dd92e67cd4019b092f53.jpg`)
                   Maria.sendMessage(from, { image: buffer, caption: '*You have chosen Dare*\n\n'+ Mariadareww }, {quoted:m})
                   break
                       

case 'truth':
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
	Maria.sendMessage(from, { react: { text: "ðŸŒ" , key: m.key }})
		
                           const truth =[
                                  "Have you ever liked anyone? How long?",
                 "If you can or if you want, which gc/outside gc would you make friends with? (maybe different/same type)",
                 "apa ketakutan terbesar kamu?",
                 "Have you ever liked someone and felt that person likes you too?",
                 "What is the name of your friend's ex-girlfriend that you used to secretly like?",
                 "Have you ever stolen money from your father or mom? The reason?",
                 "What makes you happy when you're sad?",
                 "Ever had a one sided love? if so who? how does it feel bro?", 
                 "been someone's mistress?",
                 "the most feared thing",
                 "Who is the most influential person in your life?",
                 "what proud thing did you get this year", 
                 "Who is the person who can make you awesome", 
                 "Who is the person who has ever made you very happy?", 
                 "Who is closest to your ideal type of partner here", 
                 "Who do you like to play with??", 
                 "Have you ever rejected people? the reason why?",
                 "Mention an incident that made you hurt that you still remember", 
                 "What achievements have you got this year??",
                 "What's your worst habit at school??",
                 "What song do you sing most in the shower",
                 "Have you ever had a near-death experience",
                 "When was the last time you were really angry. Why?",
                 "Who is the last person who called you",
                 "Do you have any hidden talents, What are they",
                 "What word do you hate the most?",
                 "What is the last YouTube video you watched?",
                 "What is the last thing you Googled",
                 "Who in this group would you want to swap lives with for a week",
                 "What is the scariest thing thats ever happened to you",
                 "Have you ever farted and blamed it on someone else",
                 "When is the last time you made someone else cry",
                 "Have you ever ghosted a friend",
                 "Have you ever seen a dead body",
                 "Which of your family members annoys you the most and why",
                 "If you had to delete one app from your phone, which one would it be",
                 "What app do you waste the most time on",
                 "Have you ever faked sick to get home from school",
                 "What is the most embarrassing item in your room",
                 "What five items would you bring if you got stuck on a desert island",
                 "Have you ever laughed so hard you peed your pants",
                 "Do you smell your own farts",
                 "have u ever peed on the bed while sleeping ðŸ¤£ðŸ¤£",
                 "What is the biggest mistake you have ever made",
                 "Have you ever cheated in an exam",
                 "What is the worst thing you have ever done",
                 "When was the last time you cried",
                 "whom do you love the most among ur parents", 
                 "do u sometimes put ur finger in ur nosetrilðŸ¤£", 
                 "who was ur crush during the school days",
                 "tell honestly, do u like any boy in this grup",
                 "have you ever liked anyone? how long?",
                 "do you have gf/bf','what is your biggest fear?",
                 "have you ever liked someone and felt that person likes you too?",
                 "What is the name of your ex boyfriend of your friend that you once liked quietly?",
                 "ever did you steal your mothers money or your fathers money",
                 "what makes you happy when you are sad",
                 "do you like someone who is in this grup? if you then who?",
                 "have you ever been cheated on by people?",
                 "who is the most important person in your life",
                 "what proud things did you get this year",
                 "who is the person who can make you happy when u r sad",
                 "who is the person who ever made you feel uncomfortable",
                 "have you ever lied to your parents",
                 "do you still like ur ex",
                 "who do you like to play together with?",
                 "have you ever stolen big thing in ur life? the reason why?",
                 "Mention the incident that makes you hurt that you still remember",
                 "what achievements have you got this year?",
                 "what was your worst habit at school?",
                 "do you love the bot creator Kai?",
                 "have you ever thought of taking revenge from ur teacher?",
                 "do you like current prime minister of ur country",
                 "you non veg or veg",
                 "if you could be invisible, what is the first thing you would do",
                 "what is a secret you kept from your parents",
                 "Who is your secret crush",
                 "whois the last person you creeped on social media",
                 "If a genie granted you three wishes, what would you ask for",
                 "What is your biggest regret",
                 "What animal do you think you most look like",
                 "How many selfies do you take a day",
                 "What was your favorite childhood show",
                 "if you could be a fictional character for a day, who would you choose",
                 "whom do you text the most",
                 "What is the biggest lie you ever told your parents",
                 "Who is your celebrity crush",
                 "Whats the strangest dream you have ever had",
                 "do you play pubg, if you then send ur id number"
             ]
                           const Mariatruthww = truth[Math.floor(Math.random() * truth.length)]
                           buffer = await getBuffer(`https://graph.org/file/8dd92e67cd4019b092f53.jpg`)
                           Maria.sendMessage(from, { image: buffer, caption: '*You have chosen Truth*\n'+ Mariatruthww }, {quoted:m})
                           break
                           
                           case 'fact': {
    	const { data } = await axios.get(`https://nekos.life/api/v2/fact`)
        return reply(`📍 *Fact:* ${data.fact}\n`)   
    }
    break
                           
 ///////////////////////////////////////////////////
//other menu

    case 'ig': {
if (!args[0]) return reply(`Enter Instagram Username\n\nExample: ${prefix + command} Official_bhardwaj023`)
const fg = require('api-dylux')
    try {
    let res = await fg.igStalk(args[0])
    let te = `
┌──「 *📍Instragram📍* 
▢ *⚡Name:* ${res.name} 
▢ *🔖Username:* ${res.username}
▢ *👥Follower:* ${res.followersH}
▢ *🫂Following:* ${res.followingH}
▢ *📌Bio:* ${res.description}
▢ *🏝️Posts:* ${res.postsH}
▢ *🔗 Link* : https://instagram.com/${res.username.replace(/^@/, '')}
└────────────`
     await Maria.sendMessage(m.chat, {image: { url: res.profilePic }, caption: te }, {quoted: m})
      } catch {
        reply(`Make sure the username comes from *Instagram*`)
      }
}
break

case "s":
      case "sticker":
        if (/image/.test(mime)) {
          
          let mediaMess = await quoted.download();
          let stickerMess = new Sticker(mediaMess, {
            pack: packname,
            author: global.author,
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer = await stickerMess.toBuffer();
          Maria.sendMessage(m.from, { sticker: stickerBuffer }, { quoted: m });
        } else if (/video/.test(mime)) {
          
          let mediaMess = await quoted.download();
          if ((quoted.msg || quoted).seconds > 15) {
            
            return Maria.sendMessage(
              m.from,
              { text: "Please send video less than 15 seconds." },
              { quoted: m }
            );
          }
          let stickerMess = new Sticker(mediaMess, {
            pack: packname,
            author: global.author,
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer2 = await stickerMess.toBuffer();
          Maria.sendMessage(m.from, { sticker: stickerBuffer2 }, { quoted: m });
        } else {
          
          m.reply(
            `Please mention an *image/video* and type *${prefix}s* to create sticker.`
          );
        }
        break

      default:
        if (budy.startsWith("=>")) {
          if (!isCreator) return reply(mess.botowner);
          function Return(sul) {
            sat = JSON.stringify(sul, null, 2);
            bang = util.format(sat);
            if (sat == undefined) {
              bang = util.format(sul);
            }
            return reply(bang);
          }
          try {
            reply(util.format(eval(`(async () => { ${budy.slice(3)} })()`)));
          } catch (e) {
            Maria.sendMessage(
              from,
              { image: ErrorPic, caption: String(e) },
              { quoted: m }
            );
          }
        }

        if (isCmd && budy.toLowerCase() != undefined) {
          if (m.chat.endsWith("broadcast")) return;
          if (m.isBaileys) return;
          let msgs = global.db.database;
          if (!(budy.toLowerCase() in msgs)) return;
          Maria.copyNForward(m.chat, msgs[budy.toLowerCase()], true);
        }
    }
  } catch (err) {
    Maria.sendMessage(`${ownertag}@s.whatsapp.net`, util.format(err), {
      quoted: m,
    });
    console.log(err);
  }
};
