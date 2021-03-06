var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Bot conversation
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        var membersAdded = message.membersAdded
            .map((m) => {
                var isSelf = m.id === message.address.bot.id;
                return (isSelf ? message.address.bot.name : m.name);
            })
            .join(', ');

        var reply = new builder.Message()
            .address(message.address)
            .text('いらっしゃいませー ' + membersAdded + ' さん');
        bot.send(reply);
    }

    if (message.membersRemoved) {
        var membersRemoved = message.membersRemoved
            .map((m) => {
                var isSelf = m.id === message.address.bot.id;
                return (isSelf ? message.address.bot.name : m.name);
            })
            .join(', ');

        var reply = new builder.Message()
            .address(message.address)
            .text('ばいばーい' + membersRemoved);
        bot.send(reply);
    }
});

// Bot Dialog
bot.dialog('/', new builder.IntentDialog()
    .matches(/^hello/i, '/hello')
);

bot.dialog('/hello', [
    function (session) {
        session.send('こちわっす');
        session.endDialog();
    }
]);