package MMO.Backend.Classes

class Africa(username: String) extends Continent {
  override var Name: String = username

  override def resourcePerSecond(): Double = {
    0.0
  }
}