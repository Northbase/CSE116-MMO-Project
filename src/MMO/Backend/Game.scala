package MMO.Backend

import MMO.Backend.Classes._
import play.api.libs.json.{JsValue, Json}

class Game(username: String) {
  var continent: Continent = new NorthAmerica(username)
  var money: Double = continent.Money
  var troops: Double = continent.Troops
  var resources: Double = continent.Resources
  var lastUpdateTime: Long = System.nanoTime()
//  var gameState: Map[String, Continent] = Map("NorthAmerica" -> , "SouthAmerica" -> , "Africa" -> , "Europe" -> , "Asia" -> , "Australia" -> , "Antarctica" -> )


  def toJson(): String = {
    Json.stringify(continent.toJson())
  }

  def attack(target: String , troopsAllocated: Double): Unit = { // need to convert target string into Continet class...
//    continent.invade(target, troopsAllocated)
  }

  def defend(troopsAllocated: Double): Unit = {
    continent.setupDefense(troopsAllocated)
  }

  def update(time: Long): Unit = {
    val dt = (time - this.lastUpdateTime) / 1000000000.0
    continent.update()

    this.lastUpdateTime = time
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
