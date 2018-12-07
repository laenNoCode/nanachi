const { parse } = require('querystring');
const http = require('http');
//var response = require('./response');
const fetch = require('node-fetch');
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });

/* train the bot */
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'your name', 'agent.name');
manager.addDocument('en', 'Who are you', 'agent.name');
manager.addDocument('en', 'what is your name', 'agent.name');
manager.addDocument('en', "what's your name", 'agent.name');
manager.addDocument('en', 'tell me your name', 'agent.name');

manager.addDocument('en', "you're bad", 'agent.insult');
manager.addDocument('en', "you're horrible", 'agent.insult');
manager.addDocument('en', "you're useless", 'agent.insult');
manager.addDocument('en', "you are the worst", 'agent.insult');
manager.addDocument('en', 'I hate you', 'agent.insult')

manager.addDocument('en', 'who is your master', 'agent.creator');
manager.addDocument('en', 'who do you work for', 'agent.creator');
manager.addDocument('en', 'who is your creator', 'agent.creator');
manager.addDocument('en', 'who is your owner', 'agent.creator');
manager.addDocument('en', 'who is the creator', 'agent.creator');
// Train also the NLG
manager.addAnswer('en', 'agent.name', '');
manager.addAnswer('en', 'agent.insult', '');
manager.addAnswer('en', 'agent.creator', '');
 
// Train and save the model.
(async() => {
    await manager.train();
    manager.save();
    const response = await manager.process('en', 'I have to go');
    console.log(response);
})();




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
        debut_requete = "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=";
        searchQuery = debut_requete + splitted[1];
        wikiPage = await fetchResults(searchQuery);
        console.log(wikiPage);
        return wikiPage;
    }
    return userInput;
}


// server part
const server = http.createServer((req, res) => {
    mainPage = `
    <!doctype html>
    <html>
    <body>
        <form action="/" method="post">
            <input type="text" name="userInput" /><br />
            <button>Post message</button>
        </form>
    </body>
    </html>
  `;
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            let userInput = parse(body).userInput;
            console.log("Input : " + userInput);
            getResponse(userInput).then( result => {
                console.log("Result : " + result);
                res.end(mainPage);
            });
        });
    }
    else {
      res.end(mainPage);
    }
});
server.listen(3000);