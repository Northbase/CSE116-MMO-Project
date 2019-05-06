package MMO.Backend

import MMO.Backend.Classes._
import play.api.libs.json.{JsValue, Json}
import scala.collection.mutable


class Game() {

  var players: Map[String, Continent] = Map()
//
//  var continentsMap = mutable.Map[String, Continent]()
//  var continent: Continent = new NorthAmerica(username) // placeholder
//  continentName match {
//    case "Africa" => continent = new Africa(username)
//    case "Antarctica" => continent = new Antarctica(username)
//    case "Asia" => continent = new Asia(username)
//    case "Australia" => continent = new Australia(username)
//    case "Europe" => continent = new Europe(username)
//    case "NorthAmerica" => continent = new NorthAmerica(username)
//    case "SouthAmerica" => continent = new SouthAmerica(username)
//    //    case _ =>
//  }
//  continentsMap += (continentName -> continent)

//  var money: Double = continent.Money
//  var troops: Double = continent.Troops
//  var resources: Double = continent.Resources
//  var lastUpdateTime: Long = System.nanoTime()



  def createContinent(username:String ,choice:String): Continent = {
    var continent:Continent = null
      choice match {
      case "Africa" => continent = new Africa(username)
      case "Antarctica" => continent = new Antarctica(username)
      case "Asia" => continent = new Asia(username)
      case "Australia" => continent = new Australia(username)
      case "Europe" => continent = new Europe(username)
      case "NorthAmerica" => continent = new NorthAmerica(username)
      case "SouthAmerica" => continent = new SouthAmerica(username)
      //    case _ =>
    }

    continent
  }

  def toJson(username: String): String = {
    Json.stringify(players(username).toJson())
  }

  def attack(caller: String,target: String , troopsAllocated: Double): Unit = { // need to convert target string into Continent class...
//    target match {
//      case "Africa" => continent = new Africa(username)
//      case "Antarctica" => continent = new Antarctica(username)
//      case "Asia" => continent = new Asia(username)
//      case "Australia" => continent = new Australia(username)
//      case "Europe" => continent = new Europe(username)
//      case "NorthAmerica" => continent = new NorthAmerica(username)
//      case "SouthAmerica" => continent = new SouthAmerica(username)
//    }
//    continentsMap += (target -> continent)
//    continent.invade(continentsMap(target), troopsAllocated)

    players(caller).setupAttack(troopsAllocated)

    //continent.setupAttack(troopsAllocated)      #line to be removed
  }

  def defend(caller:String,troopsAllocated: Double): Unit = {
    players(caller).setupDefense(troopsAllocated)
//    continent.setupDefense(troopsAllocated)         #line to be removed
  }

  def update(time: Long): Unit = {


    //continent.update()
  }

  def playerConnected(username : String, continent: Continent): Unit = {
    if(!players.values.toList.exists((c : Continent) => c.continentName == continent.continentName)) {
      players = players.+(username -> continent)
    }else {
      //Continent is already taken. I don't know how the server would handle that. Or maybe make it so that it cant be chosen.
    }
  }
}

//import MMO.Backend.Classes.Continent

//class Game(var ContinentsInGame : List[Continent]) {
//  var daysPassed : Int = 0
//
//  def update(): Unit = {
//    Thread.sleep(30000)
//    daysPassed+=1
//    for(continent <- ContinentsInGame) {
//      continent.update()
//    }
//  }
//}