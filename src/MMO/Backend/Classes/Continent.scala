package MMO.Backend.Classes
import play.api.libs.json
import play.api.libs.json.Json
abstract class Continent(var name: String, var Money: Int, var Troops: Int, var Resources: Int, var MoneyGrowth: Int, var TroopGrowth: Int, var ResourceGrowth: Int) {

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
    var Arr: Array[Int] = Array(Money, Troops, Resources, MoneyGrowth, TroopGrowth, ResourceGrowth)
    return Json.stringify(Json.toJson(Arr))
  }


}
}