import cluster from 'cluster'

import * as Utils from "../../src/js/helpers/utils";
import Tweet from "../../src/js/models/tweet";
import Configuration from "../../src/js/config/configuration";
import Context from "../../src/js/models/context";
import Arduino from "../../src/js/clusters/arduino";

import fs from 'fs';

/* FUNCTION TO BE TESTED
    static startAndStopLea(tweet, clusterArduino, context) {
*/

// Test getRandomMotion function
describe("renvoie un mouvement aléatoire", function() {

  let clusterArduino;// = new Arduino();
  
  // Create rank database
  beforeEach(function() {
    if (cluster.isMaster) {
      console.log("COUCOU");
      clusterArduino = cluster.fork({ type: Configuration.processConst.TYPE.CLUSTER_TWITTER });  
    } else {
      console.log("au revoir");
    }
  });

  // Suppress rank database
  afterEach(function() {
    if (cluster.isMaster) {
      clusterArduino.disconnect();
      let timeout = setTimeout(() => {
        clusterArduino.kill();
        }, 2000);
    }
  });

  it("Devrait renvoyer un easter egg", function() {
    if (cluster.isMaster) {
      let tweet = new Tweet("UserName", "ScreenName", "coucou le monde");
      clusterArduino.writeDataOnArduinoSerial(tweet);
    
      expect(Utils.getRandomMotion("exorciste")).toBe("EXORCISTE");
      expect(Utils.getRandomMotion("sos")).toBe("SOS");
    }
  });
});
