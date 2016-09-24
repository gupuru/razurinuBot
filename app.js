var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

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

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', new builder.IntentDialog()
    .matches(/^echo/i, '/echo')
    .matches(/^hello/i, '/hello')
);

// var intents = new builder.IntentDialog();
// bot.dialog('/', intents);

// intents
//     .matches(/^echo/i, '/echo')
//     .matches(/^hello/i, '/hello');

bot.dialog('/echo', [
    function (session) {
        builder.Prompts.text(session, "なにか言えよ?");
    },
    function (session, results) {
        session.send("ええと... %s", results.response);
    }
]);

bot.dialog('/hello', [
    function (session) {
        session.send('こんちわ')
    }
]);