package MMO.Backend.Classes

import play.api.libs.json.{JsValue, Json}

abstract class Continent {
  var Name: String
  var continentName: String
  var Money: Double = 5000.0
  var Troops: Double = 1000.0
  var Resources: Double = 2500.0

  var MoneyGrowth: Double = 50.0
  var TroopGrowth: Double = 50.0
  var ResourceGrowth: Double = 50.0

  var troopsDefending: Double = 0
  var troopsAttacking: Double = 0

  var pricePerAttack: Double = 1000.0
  var resourcesPerAttack: Double = 2000.0

  var pricePerDefense: Double = 5000
  var resourcesPerDefense:Double = 1000

  def invade(continent: Continent, troopsAllocated : Double) = {
    if(Money >= pricePerAttack && Resources >= resourcesPerAttack && Troops >= troopsAllocated) {

      Money -= pricePerAttack
      Resources -= resourcesPerAttack
      Troops -= troopsAllocated
      troopsAttacking += troopsAllocated

      battle(this, continent)
      troopsAttacking = 0
    }
  }

  def setupDefense(troopsAllocated : Double) = {
    if(Money >= pricePerDefense && Resources >= resourcesPerDefense && Troops >= troopsAllocated) {
      Troops -= troopsAllocated
      troopsDefending += troopsAllocated
    }
  }

  def battle(attacker: Continent, defender: Continent): Unit = {
    if(attacker.troopsAttacking > defender.troopsDefending) {
      var spoils = defender.Money * .20
      attacker.Money += spoils
      defender.Money -= spoils

      attacker.Troops += attacker.troopsAttacking
      defender.troopsDefending = 0
    } else {
      var spoils = attacker.Money * .35
      attacker.Money -= spoils
      defender.Money += spoils

      attacker.troopsAttacking = 0
    }
  }

  def update() ={
    Money += MoneyGrowth
    Troops += TroopGrowth
    Resources += ResourceGrowth
  }

  def toJson(): JsValue = {
    val map: Map[String, JsValue] = Map(
      "username" -> Json.toJson(Name),
      "continent" -> Json.toJson(continentName),
      "money" -> Json.toJson(Money),
      "troops" -> Json.toJson(Troops),
      "resources" -> Json.toJson(Resources),
      "moneyGrowth" -> Json.toJson(MoneyGrowth),
      "troopGrowth" -> Json.toJson(TroopGrowth),
      "resourceGrowth" -> Json.toJson(ResourceGrowth))
    Json.toJson(map)
  }
}



//abstract class Continent(var Name: String, var Money: Int, var Troops: Int, var Resources: Int, var MoneyGrowth: Int, var TroopGrowth: Int, var ResourceGrowth: Int) {
//
//  var troopsDefending : Int = 0
//  var troopsAttacking : Int = 0
//
//  var pricePerAttack = 10000
//  var resourcesPerAttack = 2000
//
//  var pricePerDefense = 5000
//  var resourcesPerDefense = 1000
//
//  def invade(continent: Continent, troopsAllocated : Int) = {
//    if(Money >= pricePerAttack && Resources >= resourcesPerAttack && Troops >= troopsAllocated) {
//
//      Money -= pricePerAttack
//      Resources -= resourcesPerAttack
//      Troops -= troopsAllocated
//      troopsAttacking += troopsAllocated
//
//      battle(this, continent)
//      troopsAttacking = 0
//    }
//  }
//
//  def setupDefense(troopsAllocated : Int) = {
//    if(Money >= pricePerDefense && Resources >= resourcesPerDefense && Troops >= troopsAllocated) {
//      Troops -= troopsAllocated
//      troopsDefending += troopsAllocated
//    }
//  }
//
//  def update() ={
//    Money += MoneyGrowth
//    Troops += TroopGrowth
//    Resources += ResourceGrowth
//  }
//
//  def battle(attacker: Continent, defender: Continent) {
//    if (attacker.troopsAttacking > defender.troopsDefending) {
//      var spoils = defender.Money * .20
//      attacker.Money += spoils
//      defender.Money -= spoils
//
//      attacker.Troops += attacker.troopsAttacking
//      defender.troopsDefending = 0
//    } else {
//      var spoils = attacker.Money * .35
//      attacker.Money -= spoils
//      defender.Money += spoils
//
//      attacker.troopsAttacking = 0
//    }
//  }

  //puts all the properties in an array
//  def toJson(): String = {
//    val money: String = Money.toString()
//    val troops: String = Troops.toString() //returns any, at least for me
//    val resources: String = Resources.toString()
//    val moneyGrowth: String = MoneyGrowth.toString()
//    val troopGrowth: String = TroopGrowth.toString()
//    val resourceGrowth: String = ResourceGrowth.toString
//    val Arr: Array[String] = Array(Name, money, troops, resources, moneyGrowth, troopGrowth, resourceGrowth)
//    Json.stringify(Json.toJson(Arr))
//  }
//
//
//}