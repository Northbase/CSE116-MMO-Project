package MMO.Server

import java.net.InetSocketAddress

import play.api.libs.json
import akka.actor.{Actor, ActorRef, ActorSystem, PoisonPill, Props}
import akka.io.{IO, Tcp}
import akka.util.ByteString
import play.api.libs.json.{JsValue, Json}

case class GameState(gameState: String)

class TCPserver extends Actor {
  import Tcp._
  import context.system

  IO(Tcp) ! Bind(self, new InetSocketAddress("localhost", 8000))

  var clients: Set[ActorRef] = Set()
  var gameActors = scala.collection.mutable.Map[String, ActorRef]()
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

      if(action == "connected") {
        gameActors += (username -> childActor)
        gameActors(username) ! Setup

      }else if(action == "disconnected") {
        gameActors(username) ! PoisonPill
        gameActors -= username

      }else if(action == "registered") {


      }else if(action == "play") { // need a method that distributes continent to each client
        println("players: " + clients)
//        gameActors(username) !

      }else if(action == "attack") {
        gameActors(username) ! Attack

      }else if(action == "defend") {
        gameActors(username) ! Defend

      }

    case gs: GameState =>
      this.clients.foreach((client: ActorRef) => client ! Write(ByteString(gs.gameState + "~")))
  }

}

object TCPserver {

  def main(args: Array[String]): Unit = {
    val actorSystem = ActorSystem()

    import actorSystem.dispatcher

    import scala.concurrent.duration._

    val server = actorSystem.actorOf(Props(classOf[TCPserver]))

//    actorSystem.scheduler.schedule(0 milliseconds, 100 milliseconds, server, test)
  }

}