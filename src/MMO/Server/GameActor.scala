package MMO.Server

import akka.actor.Props
import MMO.Backend.Game
import akka.actor._

case object Update
case class Setup(continentName: String)
case class Attack(targetContinent: String, troopsAllocated: Double)
case class Defend(troopsAllocated: Double)

class GameActor(username: String) extends Actor {
  var game: Game = new Game(username, "NorthAmerica") // placeholder

  override def receive: Receive = {
    case setup: Setup =>
      game = new Game(this.username, setup.continentName)
    // setup Database here
    case Update =>
      game.update(System.nanoTime())
      sender() ! GameState(game.toJson())
    case attack: Attack =>
      game.attack(attack.targetContinent, attack.troopsAllocated)
    case defend: Defend =>
      game.defend(defend.troopsAllocated)
  }
}