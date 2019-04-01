import json, sqlite3

def initalize():
    conn = sqlite3.connect("game.db")

    c = conn.cursor()

    c.execute('CREATE TABLE IF NOT EXISTS game(continent, money, troops, agriculture)')
    return (conn,c)

def write(obj):
    dict = json.loads(obj)
    array = dict['Arr']
    (conn,cur) = initalize()
    continent = array[0]
    Money = array[1]
    Troops = array[2]
    Resources = array[3]
    MoneyGrowth = array[4]
    TroopGrowth = array[5]
    ResourceGrowth = array[6]

    check = {}

    rows = cur.execute("SELECT * FROM game WHERE continent =?", (continent,))
    for row in rows:
        check = row
    if check == {}:
        cur.execute("INSERT INTO game VALUES (?,?,?,?,?,?,?)", (continent, Money, Troops, Resources, MoneyGrowth, TroopGrowth, ResourceGrowth))
        conn.commit()
    cur.close()


def read(continent):
    (conn, cur) = initalize()

    rows = cur.execute("SELECT * FROM game WHERE continent = ?", (continent,))

    data = {}
    for row in rows:
        data = {"continent": row[0], "Money": row[1], "Troops": row[2], "Resources": row[3], "MoneyGrowth": row[4], "TroopGrowth": row[5], "ResourceGrowth": row[6]}

    print(data)
    return json.dumps(data)


if __name__ == '__main__':
    initalize()
    read("northAmerica")
    write({"continent": "northAmerica", "Money": 99999, "Troops": 23, "Resources": 59897, "MoneyGrowth": 24, "TroopGrowth": 6735, "ResourceGrowth": 841})