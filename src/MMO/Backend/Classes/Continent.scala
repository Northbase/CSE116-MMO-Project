//package MMO.Backend.Classes
import play.api.libs.json
import play.api.libs.json.Json
abstract class Continent(var Name: String, var Money: Int, var Troops: Int, var Resources: Int, var MoneyGrowth: Int, var TroopGrowth: Int, var ResourceGrowth: Int) {

  var troopsDefending : Int = 0
  var troopsAttacking : Int = 0

  var pricePerAttack = 10000
  var resourcesPerAttack = 2000

  var pricePerDefense = 5000
  var resourcesPerDefense = 1000

  def invade(continent: Continent, troopsAllocated : Int) = {
    if(Money >= pricePerAttack && Resources >= resourcesPerAttack && Troops >= troopsAllocated) {

      Money -= pricePerAttack
      Resources -= resourcesPerAttack
      Troops -= troopsAllocated
      troopsAttacking += troopsAllocated

      battle(this, continent)
      troopsAttacking = 0
    }
  }

  def setupDefense(troopsAllocated : Int) = {
    if(Money >= pricePerDefense && Resources >= resourcesPerDefense && Troops >= troopsAllocated) {
      Troops -= troopsAllocated
      troopsDefending += troopsAllocated
    }
  }

  def update() ={
    Money += MoneyGrowth
    Troops += TroopGrowth
    Resources += ResourceGrowth
  }

  def battle(attacker: Continent, defender: Continent) {
    if (attacker.troopsAttacking > defender.troopsDefending) {
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
  //puts all the properties in an array
  def toJson(): String = {
    val money: String = Money.toString()
    val troops: String = Troops.toString() //returns any, at least for me
    val resources: String = Resources.toString()
    val moneyGrowth: String = MoneyGrowth.toString()
    val troopGrowth: String = TroopGrowth.toString()
    val resourceGrowth: String = ResourceGrowth.toString
    val Arr: Array[String] = Array(Name, money, troops, resources, moneyGrowth, troopGrowth, resourceGrowth)
    Json.stringify(Json.toJson(Arr))
  }


}