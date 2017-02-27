var threerest = require('threerest');
import express from "express";
import * as ServiceLeftArm from "../services/leaMove";

import Configuration from "../config/configuration";
import cluster from 'cluster'

/**s
 * Consdtructeur.
 * @constructor
 */
function Api () {

}

/**
 * Message handler pour la partie api
 * Ecrit le tweet sur le port série de l'Arduino.
 * A cause du DTR, la librairie npm serialport ne fonctionne pas
 * il faut alors passer par un script python qui va lui physiquement
 * écrire sur le port série de l'Arduino.
 * @param data les données à écrire sur le port série
 */
Api.messageHandler = function(msg) {
    console.log(msg.cluster);
    console.log('coucou le monde');
    launchExpress();
};

Api.hope = function() {
    console.log('Yahououuouououoo');
};

function launchExpress() {
    var app = express();

    app.get("/", function(req, res){
        res.send("hello world");
    });

    app.get("/moves", function(req, res){
        let tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
        Api.process
             .send({action: Configuration.processConst.ACTION.SPECIAL_MOVE, tweet: "Bonjour, je suis Léa et je bouge le bras gauche"});
        res.send("hello world cool");
    });
    threerest.ServiceLoader.loadService(app, new ServiceLeftArm.default());

    app.listen(8080, () => {console.log("Express start...");});
}


module.exports = Api;