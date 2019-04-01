import json, sqlite3

def initalize():
    conn = sqlite3.connect("game.db")

    c = conn.cursor()

    c.execute('CREATE TABLE IF NOT EXISTS game(continent, money, troops, agriculture)')
    #
    return (conn,c)

def write(obj):
    dict = json.loads(obj)
    array = dict['Arr']
    (conn,cur) = initalize()
    continent = array[0]
    Money = obj[1]
    Troops = obj[2]
    Resources = obj[3]
    MoneyGrowth = obj[4]
    TroopGrowth = obj[5]
    ResourceGrowth = obj[6]

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
        data = {"continent": row[0], "money": row[1], "agriculture": row[2], "troops": [3]}

    print(data)
    return json.dumps(data)


if __name__ == '__main__':
    initalize()
    read("northAmerica")
    write({"continent": "northAmerica", "Money": 99999, "Troops": 23, "Resources": 59897, "MoneyGrowth": 24, "TroopGrowth": 6735, "ResourceGrowth": 841})