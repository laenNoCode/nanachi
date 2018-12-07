const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('/etc/letsencrypt/live/nanachi.mine.bz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/nanachi.mine.bz/fullchain.pem',  'utf8');

const credentials = {key: privateKey, cert: certificate};
const express = require('express');
const app = express();
const basePort = 0;

//// ^ Boilerplate ^
const { parse } = require('querystring');
const fetch = require('node-fetch');
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });

const static_options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: "index.html",
    maxAge: '2s',
    redirect: false,
    setHeaders: (res, path, stat) => {
        res.set('x-timestamp', Date.now())
    }
};

app.use(express.static('public', static_options));

app.post('/botFetch', (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            let userInput = chunk.toString();
            console.log("Input : " + userInput);
            getResponse(userInput)
            .then( result => {
                if (result) {
                    res.writeHead(200, {"Content-Type": "text/plain"});
                   
                    res.write(result);
                    res.end();
                    console.log("Result : " + result);
                } else {
                    console.log("Don't understand");
                    res.end();
                }
            })
            .catch(function (err) {
                console.log("Promise Rejected" + err);
           });
        });
        /*
        req.on('end', () => {

        });
        */
    }
});
// app.get('/', (req, res) => {});


/* train the bot */
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'your name', 'agent.name');
manager.addDocument('en', 'Who are you', 'agent.name');
manager.addDocument('en', 'what is your name', 'agent.name');
manager.addDocument('en', "what's your name", 'agent.name');
manager.addDocument('en', 'tell me your name', 'agent.name');
/*
manager.addDocument('en', "you're bad", 'agent.insult');
manager.addDocument('en', "you're horrible", 'agent.insult');
manager.addDocument('en', "you're useless", 'agent.insult');
manager.addDocument('en', "you are the worst", 'agent.insult');
*/
manager.addDocument('en', 'I hate you', 'agent.insult');
manager.addDocument('en', 'I hate you so much', 'agent.insult');

manager.addDocument('en', 'help', 'command.help');
manager.addDocument('en', 'help me', 'command.help');
manager.addDocument('en', 'can you help me', 'command.help');
manager.addDocument('en', 'i need some help', 'command.help');
manager.addDocument('en', 'please help me', 'command.help');

manager.addDocument('en', 'are you stupid', 'agent.insultStupid');
manager.addDocument('en', 'you are so stupid', 'agent.insultStupid');
manager.addDocument('en', 'noob', 'agent.insultStupid');
manager.addDocument('en', 'i am more clever than you', 'agent.insultStupid');
manager.addDocument('en', 'i am smarter than you', 'agent.insultStupid');

manager.addDocument('en', 'who is your master', 'agent.creator');
manager.addDocument('en', 'who do you work for', 'agent.creator');
manager.addDocument('en', 'who is your creator', 'agent.creator');
manager.addDocument('en', 'who is your owner', 'agent.creator');
manager.addDocument('en', 'who is the creator', 'agent.creator');

manager.addDocument('en', 'help', 'command.help');
manager.addDocument('en', 'help me', 'command.help');
manager.addDocument('en', 'can you help me', 'command.help');
manager.addDocument('en', 'i need some help', 'command.help');
manager.addDocument('en', 'please help me', 'command.help');

manager.addDocument('en', 'what accident', 'nanachi.accident');
manager.addDocument('en', 'tell me more about the accident', 'nanachi.accident');
manager.addDocument('en', 'what happened during the accident', 'nanachi.accident');
manager.addDocument('en', 'how did nanachi die', 'nanachi.accident');
manager.addDocument('en', 'how did she die', 'nanachi.accident');

manager.addDocument('en', 'Tell me something about', 'command.wiki');
manager.addDocument('en', 'What is', 'command.wiki');
manager.addDocument('en', 'Can you search this on wikipedia?', 'command.wiki');
manager.addDocument('en', 'How can I search something on Wikipedia?', 'command.wiki');

// Train also the NLG
manager.addAnswer('en', 'agent.name', 'I am the true Nanachi! The fake one died in an accident.');

manager.addAnswer('en', 'agent.insult', "I don't lke you neither");
manager.addAnswer('en', 'agent.insult', "Wait a second... ps -aux... Ho, I got it... kill -9 user... Are you still here? Crap!");

manager.addAnswer('en', 'agent.insultStupid', "https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect");

manager.addAnswer('en', 'agent.creator', "Why are you asking me this? I don't care about him. And I don't care about you neither.");

manager.addAnswer('en', 'command.help', "Well, I can (but I won't)");
manager.addAnswer('en', 'command.help', "Why should I do that?");
manager.addAnswer('en', 'command.help', "Here is a friend of yours: https://www.google.com/");
manager.addAnswer('en', 'command.help', "Click on the red cross at the top left of your screen");

manager.addAnswer('en', 'nanachi.accident', "She slipped in the abyss and has not returned yet. I told everyone that she died, but nobody believed me. Do you know what is worst? I am currently speaking to you...");

manager.addAnswer('en', 'command.wiki', "If you want me to search something on wikipedia, just type 'wiki X' where X is the thing you want to know about.");



async function fetchResults(searchQuery) {
    page = "Page non trouvée";
    try {
        response = await fetch(searchQuery);
        data = await response.json();
        const results = data.query.search;
        page = encodeURI("https://en.wikipedia.org/wiki/" + results[0].title);
        console.log("page : " + page);
    }
    catch (e) {
        console.log('An error occurred');
    }
    return page;
}


async function getResponse(userInput) {
    let splitted = userInput.split(" ");
    if (splitted[0] == "wiki" && splitted.length == 2) {
        //return "I will search " + splitted[1] + " on wikipedia";
        let debut_requete = "Here is your answer : "
        debut_requete += "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=";
        let searchQuery = debut_requete + splitted[1];
        let wikiPage = await fetchResults(searchQuery);
        console.log(wikiPage);
        return wikiPage;
    }
    else {
        response = await manager.process('en', userInput);
        if (response.answer) {
            return response.answer;
        } else {
            //return "I didn't undertand."
        }
    }
}




// Train and save the model.
(async() => {
    await manager.train();
    manager.save();
    //const response = await manager.process('en', 'I have to go');
    //console.log(response);
})().then(() => {
    console.log("I am ready");
    
    //// v Boilerplate v

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    (port => {
        httpServer.listen(port, () => console.log(`Http on port ${port}`));
    })(basePort + 5000);

    (port => {
        httpsServer.listen(port, () => console.log(`Https on port ${port}`));
    })(basePort + 443);
});