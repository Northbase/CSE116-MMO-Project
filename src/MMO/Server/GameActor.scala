package MMO.Server

import akka.actor.Props
//import MMO.Backend.Game
import akka.actor._

case object Update
case object Setup
case object Attack
case object Defend

class GameActor(username: String) extends Actor {
//  var game = new Game(username)

  override def receive: Receive = {
    case Setup =>
      // setup Database
    case Update =>
      // essentially sends game state(JSON format) to each clients
//      sender() ! GameState()
    case Attack =>
      //
    case Defend =>
      //
  }
}
