package MMO.Server

import akka.actor.Props
import MMO.Backend.Game
import akka.actor._

case object Update
case object Setup
case class Attack(targetContinent: String, troopsAllocated: Double)
case class Defend(troopsAllocated: Double)

class GameActor(username: String) extends Actor {
  // Game class is setup by the username
  // continents are pulled from database...
  // continents are distributed to players in chronological order ...

  var game: Game = new Game(username)
  override def receive: Receive = {
    case Setup =>
      // setup Database
    case Update =>
      game.update(System.nanoTime())
      sender() ! GameState(game.toJson())
    case attack: Attack =>
      game.attack(attack.targetContinent, attack.troopsAllocated)
    case defend: Defend =>
      game.defend(defend.troopsAllocated)
  }
}
