import TwitterAPI from "twitter";

import Tweet from "../models/tweet";
import Configuration from "../config/configuration";
import {chooseSound} from "../helpers/sound";
import Context from "../models/context";
import {isAdmin, isDemoOn, isDemoOff} from "../helpers/utils";
import logger from "../helpers/log";

var client;

/**
 * Constructeur.
 * @constructor
 */
function Twitter() {}

/**
 * Ecoute des tweets grâce à l'API streaming de twitter.
 * Les credentials sont fixés par des variables d'environnement
 */
Twitter.streamTwitter = function() {

  client = new TwitterAPI({
    "consumer_key": process.env.TWITTER_CONSUMER_KEY,
    "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
    "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
    "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  logger.log('debug', "Création du client Twitter...");
  let stream = client.stream('statuses/filter', {track: 'lea_nmakers'});

  stream.on('data', function(tweetReceived) {
    logger.log('debug', "On a reçu un tweet");
    if (!tweetReceived.retweeted_status) {

      logger.log('debug', "isAdmin : " + isAdmin(tweetReceived.user.screen_name));
      logger.log('debug', "isDemoOn : " + isDemoOn(tweetReceived));
      logger.log('debug', "isDemonOff : " + isDemoOff(tweetReceived));
      // Si on est un admin et que l'on demande l'activation du mode démo, alors on l'active
      if (isAdmin(tweetReceived.user.screen_name) && isDemoOn(tweetReceived)) {
        logger.log('debug', "Etape 1");
        Context.isDemoMode = true;
        // Si on est un admin et que l'on demande la désactivation du mode démo, alors on le désactive
      } else if (isAdmin(tweetReceived.user.screen_name) && isDemoOff(tweetReceived)) {
        logger.log('debug', "Etape 2");
        Context.isDemoMode = false;
      }
      logger.log('debug', "Etape 3");
      // Si on n'est pas en mode démo et qu'on ne vient pas juste de le désactiver
      if (!isDemoOff(tweetReceived) && !isDemoOn(tweetReceived)) {
        if (!Context.isDemoMode) {
          logger.log('debug', "Etape 4");
          Twitter.receivingTweet(tweetReceived);
          // Si on est admin
        } else if (isAdmin(tweetReceived.user.screen_name)) {
          logger.log('debug', "Etape 5");
          Twitter.receivingTweet(tweetReceived);
        }
      }
    }
  });

  stream.on('error', function(error) {
    throw error;
  });
}

Twitter.receivingTweet = function(tweetReceived) {
  let tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
  // Il faut choisir le son associé au tweet
  tweet.sound = chooseSound(tweet);
  Twitter
    .process
    .send({action: Configuration.processConst.ACTION.SHOW_TWEET, tweet: tweet});
}

/**
 * Message handler pour la partie twitter
 * Il permet l'aiguillage au sein du code pour la partie twitter à effectuer
 * @param msg message contenant le type d'action à effectuer
 */
Twitter.messageHandler = function(msg) {
  if (msg.action == Configuration.processConst.ACTION.LISTEN_TWEET) {
    Twitter.streamTwitter();
  }
};

module.exports = Twitter;