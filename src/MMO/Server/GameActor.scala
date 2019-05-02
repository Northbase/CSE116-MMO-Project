package MMO.Server

import akka.actor.Props
//import MMO.Backend.Game
import akka.actor._

case object Update
case object Setup
case object Attack
case object Defend

class GameActor(username: String) extends Actor {
  // Game class is setup my the username
  // continents are pulled from database...
  // continents are distributed to players in chronological order ...

  override def receive: Receive = {
//    var game = new Game(username)
    case Setup =>
      // setup Database
    case Update =>
      // essentially sends game state(JSON format) to each clients
      // refer to Continent.toJson method to get JSON
//      sender() ! GameState()
    case Attack =>
      // need attack method in game class
    case Defend =>
      // need defend method in game class
  }
}
