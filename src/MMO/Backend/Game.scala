package MMO.Backend

import MMO.Backend.Classes._
import play.api.libs.json.{JsValue, Json}
import scala.collection.mutable


class Game(username: String, continentName: String) {
  var continentsMap = mutable.Map[String, Continent]()
  var continent: Continent = new NorthAmerica(username) // placeholder
  continentName match {
    case "Africa" => continent = new Africa(username)
    case "Antarctica" => continent = new Antarctica(username)
    case "Asia" => continent = new Asia(username)
    case "Australia" => continent = new Australia(username)
    case "Europe" => continent = new Europe(username)
    case "NorthAmerica" => continent = new NorthAmerica(username)
    case "SouthAmerica" => continent = new SouthAmerica(username)
    //    case _ =>
  }
  continentsMap += (continentName -> continent)

  var money: Double = continent.Money
  var troops: Double = continent.Troops
  var resources: Double = continent.Resources
  var lastUpdateTime: Long = System.nanoTime()



  def toJson(): String = {
    Json.stringify(continent.toJson())
  }

  def attack(target: String , troopsAllocated: Double): Unit = { // need to convert target string into Continent class...
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
    continent.setupAttack(troopsAllocated)
  }

  def defend(troopsAllocated: Double): Unit = {
    continent.setupDefense(troopsAllocated)
  }

  def update(time: Long): Unit = {
    continent.update()
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