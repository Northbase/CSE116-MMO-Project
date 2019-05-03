package MMO.Backend.Classes

class SouthAmerica(username: String) extends Continent {
  override var Name: String = username

  override def resourcePerSecond(): Double = {
    0.0
  }
}

//class SouthAmerica extends Continent(500000, 750000, 2000000, Map("Money" -> 500, "Troops" -> 250, "Resources" -> 2000)){
//
//}
