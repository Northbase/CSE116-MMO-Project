import json, sqlite3

def initalize():
    conn = sqlite3.connect("game.db")

    c = conn.cursor()

    c.execute('CREATE TABLE IF NOT EXISTS game(continent, money, troops, agriculture)')

    return (conn,c)

def write(obj):

    (conn,cur) = initalize()

    continent = obj["continent"]
    Money = obj["Money"]
    Troops = obj["Troops"]
    GrowthRate = obj["GrowthRate"]


    check = {}

    rows = cur.execute("SELECT * FROM game WHERE continent =?", (continent,))
    for row in rows:
        check = row
    if check == {}:
        cur.execute("INSERT INTO game VALUES (?,?,?,?)", (continent, Money, GrowthRate, Troops, ))
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

#
if __name__ == '__main__':
    initalize()
    read("northAmerica")
    write({"continent": "northAmerica", "Money": 99999, "Troops": 23, "GrowthRate": 59897, })
