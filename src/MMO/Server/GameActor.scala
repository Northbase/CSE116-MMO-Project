package MMO.Server

import akka.actor.Props
import MMO.Backend.Game
import akka.actor._

case object Update
case class Setup(continentName: String)
case class Attack(targetContinent: String, troopsAllocated: Double)
case class Defend(troopsAllocated: Double)

class GameActor(username: String) extends Actor {
  //var game: Game = new Game(username, "NorthAmerica") // placeholder
    var game: Game = new Game()

  override def receive: Receive = {
    case setup: Setup =>
      game.playerConnected(this.username, game.createContinent(this.username,setup.continentName))

    //game = new Game(this.username, setup.continentName)
    // setup Database here
    case Update =>
      game.update(System.nanoTime())
      sender() ! GameState(game.toJson(this.username))
    case attack: Attack =>
      game.attack(this.username,attack.targetContinent, attack.troopsAllocated)
    case defend: Defend =>
      game.defend(this.username, defend.troopsAllocated)
  }
}