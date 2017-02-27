import { Service } from "threerest";
import { Methods } from "threerest";
import { Hal } from "threerest";

import Api from "../clusters/api";

import cluster from 'cluster';

import Configuration from "../config/configuration";

@Service.path("/moves")
export default class ServiceLeaMove {

  @Methods.get("/")
  @Hal.halServiceMethod(true)
  moveLeftArm() {
    console.log("coucouXX");

    Api.hope();
    //cluster.process
             // .send({action: Configuration.processConst.ACTION.SPECIAL_MOVE, tweet: "Bonjour, je suis Léa et je bouge le bras gauche"});
  }
  
  

}
