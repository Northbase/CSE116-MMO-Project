package MMO.Backend

import MMO.Backend.Classes._
import play.api.libs.json.{JsValue, Json}
import scala.collection.mutable


class Game(username: String, continentName: String) {
  var continentsMap = mutable.Map[String, Continent]()
  var continent: Continent = new Unclaimed(username) // placeholder
  val targetContinent: Continent = new Unclaimed("_____") // placeholder


  continentName match {
    case "Africa" => continent = new Africa(username)
    case "Antarctica" => continent = new Antarctica(username)
    case "Asia" => continent = new Asia(username)
    case "Australia" => continent = new Australia(username)
    case "Europe" => continent = new Europe(username)
    case "NorthAmerica" => continent = new NorthAmerica(username)
    case "SouthAmerica" => continent = new SouthAmerica(username)
    case _ => continent = new Unclaimed(username)
  }
  continentsMap += (continentName -> continent)

  var money: Double = continent.Money
  var troops: Double = continent.Troops
  var resources: Double = continent.Resources
  var lastUpdateTime: Long = System.nanoTime()



  def toJson(): String = {
    val map: Map[String, JsValue] = Map(
      continent.continentName -> continent.toJson(),
      targetContinent.continentName -> targetContinent.toJson()
    )
    Json.stringify(Json.toJson(map))

//    Json.stringify(continent.toJson())
//    Json.stringify(targetContinent.toJson())
  }

  def attack(targetContinentName: String , targetID: String, troopsAllocated: Double, currentRoomGameState: JsValue): Unit = {
//    val targetContinent: Continent = new Unclaimed(username)
    val test = (currentRoomGameState \ targetID)
//    val targetContinentName = (test \ "continent").as[String]
    val money = (test \ "money").as[Double]
//    val moneyGrowth = (test \ "moneyGrowth").as[Double]
    val resources = (test \ "resources").as[Double]
//    val resourceGrowth = (test \ "resourceGrowth").as[Double]
    val troops = (test \ "troops").as[Double]
//    val troopsGrowth = (test \ "troopsGrowth").as[Double]

    targetContinent.continentName = targetContinentName
    targetContinent.Money = money
    targetContinent.Resources = resources
    targetContinent.Troops = troops

    continent.invade(targetContinent, troopsAllocated)

  }

  def defend(troopsAllocated: Double, currentRoomGameState: JsValue): Unit = {
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
