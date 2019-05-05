package MMO.Server

import play.api.libs.json._
import akka.actor.Props
import MMO.Backend.Game
import akka.actor._

case object Update
case class Setup(continentName: String)
case class Attack(targetContinent: String, targetID: String, troopsAllocated: Double, currentRoomGameState: JsValue)
case class Defend(troopsAllocated: Double, currentRoomGameState: JsValue)

class GameActor(username: String) extends Actor {
  var game: Game = new Game("_____", "Unclaimed") // placeholder

  override def receive: Receive = {
    case setup: Setup =>
      game = new Game(this.username, setup.continentName)
      // setup Database here
    case Update =>
      game.update(System.nanoTime())
      sender() ! GameState(game.toJson())
    case attack: Attack => // parse by usernames...
//      println(attack.currentRoomGameState.getClass)
//      val test = (attack.currentRoomGameState \ username)
//      println(test)
//      println("MONEY",  test \ "resources")
      game.attack(attack.targetContinent, attack.targetID, attack.troopsAllocated, attack.currentRoomGameState)
      sender() ! GameState(game.toJson())

    case defend: Defend =>
      game.defend(defend.troopsAllocated, defend.currentRoomGameState)
      sender() ! GameState(game.toJson())

  }
}
