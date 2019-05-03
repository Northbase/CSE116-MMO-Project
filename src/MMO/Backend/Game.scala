package MMO.Backend

import MMO.Backend.Classes._
import play.api.libs.json.{JsValue, Json}

class Game(username: String, continentName: String) {
  var continent: Continent = new NorthAmerica(username)
  var money: Double = 5000.0
  var troops: Double = 300.0
  var resources: Double = 2500.0
  var lastUpdateTime: Long = System.nanoTime()
  var gameState: Map[String, JsValue] = Map()

  def invade(targetContinentName: String): Unit = {
  }

  def setupDefense(): Unit = {
  }

  def toJson(): String = {
    ""
  }

  def update(time: Long): Unit = {
    val dt = (time - this.lastUpdateTime) / 1000000000.0
//    money += dt
//    troops += dt
//    resources += dt

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
