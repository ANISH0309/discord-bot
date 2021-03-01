require('dotenv').config();

const { Client, WebhookClient } = require('discord.js');
const client = new Client({
    partials: ['MESSAGE','REATION']
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN,
)
const PREFIX = '$';

client.on('ready',() => {
    console.log(`${client.user.tag} has logged in.`);
});

client.on('message',async (message) =>{
    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/); //regex used
    if(CMD_NAME === 'kick'){
        if(!message.member.hasPermission('KICK_MEMBERS'))
         return message.reply('You do not have permissions to use that command');
        if(args.length === 0)
         return message.reply('please provide an ID');
        const member = message.guild.members.cache.get(args[0]);        
        if(member){
            member
                .kick()
                .then((member) => message.channel.send(`${member} was kicked`))
                .catch((err) => message.channel.send('I cannot kick that user :('));
        } else{
            message.channel.send("That user was not found");
        }
    }else if(CMD_NAME === 'ban'){
        if(!message.member.hasPermission('BAN_MEMBERS'))
         return message.reply('You do not have permissions to use that command');
        if(args.length === 0)
         return message.reply('please provide an ID');

        try{
            const user = await message.guild.members.ban(args[0]);
            message.channel.send("user was successfully banned");
            console.log(user);
        } catch(err){
            console.log(err);
            message.channel.send("An error occured. Either i do not have permissions or the user was not found");
        }
    }else if(CMD_NAME === 'announce'){
        console.log(args);
        const msg = args.join(' ');
        console.log(msg);
        webhookClient.send(msg);
    }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '816029644855836712') {
      switch (name) {
        case '🍎':
          member.roles.add('813836148220362752');
          break;
        case '🍌':
          member.roles.add('813836206517256284');
          break;
      }
    }
  });
  
  client.on('messageReactionRemove', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '816029644855836712') {
      switch (name) {
        case '🍎':
          member.roles.remove('813836148220362752');
          break;
        case '🍌':
          member.roles.remove('813836206517256284');
          break;
      }
    }
  });

client.login(process.env.DISCORD_BOT_TOKEN);
