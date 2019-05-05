package MMO.Server

import java.net.InetSocketAddress

import akka.actor.{Actor, ActorRef, ActorSystem, PoisonPill, Props}
import akka.io.{IO, Tcp}
import akka.util.ByteString
import play.api.libs.json._
import scala.collection.mutable

case class GameState(gameState: String)
case object UpdateGames

class TCPserver extends Actor {
  import Tcp._
  import context.system

  IO(Tcp) ! Bind(self, new InetSocketAddress("localhost", 8000))

  var clients: Set[ActorRef] = Set()
  var gameActors = mutable.Map[String, ActorRef]()
  var lobby = mutable.Map[String, mutable.Map[String, String]]("0" -> mutable.Map(), "1" -> mutable.Map(), "2" -> mutable.Map(), "3" -> mutable.Map())

  var buffer: String = ""
  val delimiter: String = "~"

  override def receive: Receive = {
    case b: Bound =>
      println("Listening on port: " + b.localAddress.getPort)
    case c: Connected =>
      println("new connection: " + c.remoteAddress)
      this.clients = this.clients + sender()
      sender() ! Register(self)
    case PeerClosed =>
      println("disconnected: " + sender())
      this.clients = this.clients - sender()
    case r: Received =>
      println("Received: " + r.data.utf8String)
      val JSONdata: JsValue = Json.parse(r.data.utf8String)
      val username: String = (JSONdata \ "username").as[String]
      val action: String = (JSONdata \ "action").as[String]
      val childActor: ActorRef = context.actorOf(Props(classOf[GameActor], username))

      if(action == "registered") {
        gameActors += (username -> childActor)
      }else if(action == "disconnected") {
        gameActors(username) ! PoisonPill // kill player's gameActor
        gameActors -= username // remove player from gameActor map
        lobby.foreach( r => { // remove player from lobby map
          if(r._2.keySet.contains(username)) { lobby(r._1) -= username}
        })
      }else if(action == "joinRoom") {
        val status: String = (JSONdata \ "status").as[String]
        val room: String = (JSONdata \ "room").as[String]
        if(status == "pass") {
          lobby(room)(username) = ""
        }
      }else if(action == "playGame") {
        val status: String = (JSONdata \ "status").as[String]
        val room: String = (JSONdata \ "room").as[String]
        val continent: String = (JSONdata \ "continent").as[String]
        if(status == "pass") {
          lobby(room)(username) = continent
          gameActors(username) ! Setup(continent)
        }
      }else if(action == "attack") {
        val target: String = (JSONdata \ "target").as[String]
        val targetID: String = (JSONdata \ "targetID").as[String]
        val allocated: Double = (JSONdata \ "allocated").as[Double]
        val fullGameState: JsValue = (JSONdata \ "currentRoomGameState").as[JsValue]

        gameActors(username) ! Attack(target, targetID, allocated, fullGameState)
      }else if(action == "defend") {
        val allocated: Double = (JSONdata \ "allocated").as[Double]
        val fullGameState: JsValue = (JSONdata \ "currentRoomGameState").as[JsValue]

        gameActors(username) ! Defend(allocated, fullGameState)
      }
    case gs: GameState =>
      this.clients.foreach((client: ActorRef) => client ! Write(ByteString(gs.gameState + "~")))
    case UpdateGames =>
      this.gameActors.foreach( kv => kv._2 ! Update )
  }

}

object TCPserver {

  def main(args: Array[String]): Unit = {
    val actorSystem = ActorSystem()

    import actorSystem.dispatcher

    import scala.concurrent.duration._

    val server = actorSystem.actorOf(Props(classOf[TCPserver]))

    actorSystem.scheduler.schedule(0 milliseconds, 100 milliseconds, server, UpdateGames)
  }

}