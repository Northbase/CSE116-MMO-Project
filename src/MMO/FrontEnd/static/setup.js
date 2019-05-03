const Application = PIXI.Application;
const Container = PIXI.Container;
const Sprite = PIXI.Sprite;
const TextureCache = PIXI.utils.TextureCache;
const Rectangle = PIXI.Rectangle;
const Texture = PIXI.Texture;
const Text = PIXI.Text;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;

let socket = io.connect({transports: ['websocket']});

function registerUser(username) {
    socket.emit("register", username); // send "register" to the server
}

// socket.on('connect', function(event) {
// });

socket.on('message', function(event) { // handle gold, money, military display here.
    window.gameState = event["gameState"];
    window.lobby = event["lobby"];
    // console.log(lobby[currentRoom][currentContinent]);
    // console.log(Object.values(lobby));
});


let app = new Application({
    width: 1280,
    height: 720,
    antialias: true,
    transparent: false,
    backgroundColor: "0x21225b"
});

document.body.appendChild(app.view);

loader
    .add("textures/tilemap.png")
    .add("textures/GUI.png")
    .load(setup);

let rooms = ["0", "1", "2", "3"];
let continents = ["North America", "South America", "Africa", "Europe", "Asia", "Australia", "Antarctica"];
let currentRoom = "";
let currentContinent = "";
let targetLocation;


function setup() {

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * **
    * SCREEN SIZE                                               *
    * screen = 1280x720 px <1px-based> 1280x720 tiles           *
    * game = 1200x585 px <15px-based> 80x39 tiles               *
    * map = 400x195 px <5px-based>  80x39 tiles                 *
    ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    var GUIborder = [40, 30]; //40px horizontal gap; 30px vertical gap (from top left corner)
    var MAPborder = [835, 500]; //870 px horizontal gap; 490px vertical gap (from top left corner)

    var tilemap = TextureCache["textures/tilemap.png"];
    var sand_rect = new Texture(tilemap, new Rectangle(0, 0, 250, 250));
    var grass_rect = new Texture(tilemap, new Rectangle(250, 0, 250, 250));
    var water_rect = new Texture(tilemap, new Rectangle(500, 0, 250, 250));
    var ground_rect = new Texture(tilemap, new Rectangle(750, 0, 250, 250));
    var ice_rect = new Texture(tilemap, new Rectangle(1000, 0, 250, 250));
    var dirt_rect = new Texture(tilemap, new Rectangle(1250, 0, 250, 250));

    var GUI = TextureCache["textures/GUI.png"];
    var empty_rect = new Texture(GUI, new Rectangle(0, 0, 250, 250));
    var eventBox_rect = new Texture(GUI, new Rectangle(250, 0, 250, 250));
    var profile_rect = new Texture(GUI, new Rectangle(500, 0, 250, 250));
    var gold_stat_rect = new Texture(GUI, new Rectangle(750, 0, 250, 250));
    var military_stat_rect = new Texture(GUI, new Rectangle(1000, 0, 250, 250));
    var agriculture_stat_rect = new Texture(GUI, new Rectangle(1250, 0, 250, 250));
    var pressAttack_rect = new Texture(GUI, new Rectangle(1500, 0, 250, 250));
    var pressDefend_rect = new Texture(GUI, new Rectangle(1750, 0, 250, 250));

    var playButton_rect = new Texture(GUI, new Rectangle(0, 250, 250, 250));
    var logo_rect = new Texture(GUI, new Rectangle(250, 250, 500, 250));
    var joinButton_rect = new Texture(GUI, new Rectangle(750, 250, 250, 250));
    var start_rect = new Texture(GUI, new Rectangle(1005, 250, 250, 250));

    // components
    var MAIN_MENU_component = new Container();
    var ROOM_SELECT_component = new Container();
    var CONTINENT_SELECT_component = new Container();
    var GUI_component = new Container();
    var TILEMAP_component = new Container();

    /************************************* GUI ***************************************************************/
    var logo = new Sprite(logo_rect);
    logo.anchor.set(0.5, 0.5);
    logo.width = 350;
    logo.height = 100;
    logo.position.set(app.screen.width/2, app.screen.height/2);
    MAIN_MENU_component.addChild(logo);

    var startButton = new Sprite(start_rect);
    startButton.anchor.set(0.5, 0.5);
    startButton.position.set(app.screen.width/2, app.screen.height/2 + 150);
    startButton.width = 90;
    startButton.height = 90;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("click", ()=> {
        state = roomSelect;
        for(var i = 0; i < 4; i++) {
            createRoom(i);
        }
    });
    MAIN_MENU_component.addChild(startButton);

    function createRoom(roomSerialNumber) {
        var room = new Sprite(empty_rect);
        room.tint = "0xe1e6ed";
        room.interactive = true;
        room.buttonMode = true;
        room.anchor.set(0.5, 0.5);
        room.width = 250;
        room.height = 250;
        room.position.set(250 + (roomSerialNumber) * 260, 300);
        room.on("click", () => {
            currentRoom = roomSerialNumber;

            ROOM_SELECT_component.children.forEach( c => { c.tint = "0xe1e6ed"; });
            room.tint = "0xc4b5a6";
            console.log(currentRoom);
        });
        ROOM_SELECT_component.addChild(room);
    }

    var joinButton = new Sprite(joinButton_rect);
    joinButton.tint = "0xe1e6ed";
    joinButton.interactive = true;
    joinButton.buttonMode = true;
    joinButton.anchor.set(0.5, 0.5);
    joinButton.width = 90;
    joinButton.height = 90;
    joinButton.position.set(app.screen.width/2, app.screen.height/2  + 250);
    joinButton.on("click", () => {
        if(rooms.includes(currentRoom.toString()) && Object.keys(lobby[currentRoom]).length < 7) {// also need to check if room is occupied...
            socket.emit("joinRoom", {"room": currentRoom.toString(), "continent": currentContinent}); // send "join" to the server

            state = continentSelect;
            for(var i = 0; i < continents.length; i++) {
                selectContinent(currentRoom, i);
            }
        }
    });
    ROOM_SELECT_component.addChild(joinButton);

    function selectContinent(roomNumber, continentSerialNumber) {
        var continentGrid = new Sprite(empty_rect);
        continentGrid.tint = "0xe1e6ed";
        continentGrid.interactive = true;
        continentGrid.buttonMode = true;
        continentGrid.anchor.set(0.5, 0.5);
        continentGrid.width = 150;
        continentGrid.height = 150;
        continentGrid.position.set(180 + continentSerialNumber * 155, 300);
        continentGrid.on("click", () => {
            currentContinent = continents[continentSerialNumber];

            CONTINENT_SELECT_component.children.forEach( c => { c.tint = "0xe1e6ed"; });
            continentGrid.tint = "0xc4b5a6";
            console.log(roomNumber, currentContinent);
        });
        CONTINENT_SELECT_component.addChild(continentGrid);
    }

    var playButton = new Sprite(playButton_rect);
    playButton.tint = "0xe1e6ed";
    playButton.anchor.set(0.5, 0.5);
    playButton.position.set(app.screen.width/2, app.screen.height/2 + 150);
    playButton.width = 90;
    playButton.height = 90;
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.on("click", ()=> {
        console.log(Object.values(lobby[currentRoom]));
        var occupiedContinents = Object.values(lobby[currentRoom])
        if(continents.includes(currentContinent) && occupiedContinents.includes(currentContinent) == false) { // also need to check if current is occupied...
            state = play;
            socket.emit("playGame", {"room": currentRoom.toString(), "continent": currentContinent});
        }
    });
    CONTINENT_SELECT_component.addChild(playButton);

    var profile = new Sprite(profile_rect);
    profile.position.set(GUIborder[0], GUIborder[1]+590);
    profile.width = 90;
    profile.height = 90;
    GUI_component.addChild(profile);

    var gold_stat = new Sprite(gold_stat_rect);
    gold_stat.position.set(GUIborder[0]+100, GUIborder[1]+590);
    gold_stat.width = 90;
    gold_stat.height = 90;
    GUI_component.addChild(gold_stat);

    window.gold_magnitude = new Text();
    gold_magnitude.position.set(GUIborder[0]+110, GUIborder[1]+650);
    gold_magnitude.style.fill = 0x000000;
    gold_magnitude.style.fontSize = 15;
    gold_magnitude.style.fontFamily = "Times New Roman";
    GUI_component.addChild(gold_magnitude);

    var military_stat = new Sprite(military_stat_rect);
    military_stat.position.set(GUIborder[0]+190, GUIborder[1]+590);
    military_stat.width = 90;
    military_stat.height = 90;
    GUI_component.addChild(military_stat);

    window.military_magnitude = new Text();
    military_magnitude.position.set(GUIborder[0]+200, GUIborder[1]+650);
    military_magnitude.style.fill = 0x000000;
    military_magnitude.style.fontSize = 15;
    military_magnitude.style.fontFamily = "Times New Roman";
    GUI_component.addChild(military_magnitude);

    var agriculture_stat = new Sprite(agriculture_stat_rect);
    agriculture_stat.position.set(GUIborder[0]+280, GUIborder[1]+590);
    agriculture_stat.width = 90;
    agriculture_stat.height = 90;
    GUI_component.addChild(agriculture_stat);

    window.agriculture_magnitude = new Text();
    agriculture_magnitude.position.set(GUIborder[0]+290, GUIborder[1]+650);
    agriculture_magnitude.style.fill = 0x000000;
    agriculture_magnitude.style.fontSize = 15;
    agriculture_magnitude.style.fontFamily = "Times New Roman";
    GUI_component.addChild(agriculture_magnitude);

    var eventBox = new Sprite(eventBox_rect);
    eventBox.position.set(GUIborder[0]+445, GUIborder[1]+560);
    eventBox.width =  335;
    eventBox.height = 120;
    GUI_component.addChild(eventBox);

    window.event_broadcast = new Text();
    event_broadcast.position.set(GUIborder[0]+445, GUIborder[1]+570);
    event_broadcast.style.fill = 0x000000;
    event_broadcast.style.fontSize = 20;
    event_broadcast.style.fontFamily = "Times New Roman";
    GUI_component.addChild(event_broadcast);

    var pressAttack = new Sprite(pressAttack_rect);
    pressAttack.interactive = true;
    pressAttack.buttonMode = true;
    pressAttack.position.set(GUIborder[0]+380, GUIborder[1]+560);
    pressAttack.width = 60;
    pressAttack.height = 60;
    pressAttack.on("click", ()=> {
        if(continents.includes(targetLocation) && targetLocation != gameState.continent) {
            socket.emit("attack", {"target": targetLocation, "allocated": 300.0});
        }
    });
    GUI_component.addChild(pressAttack);

    var pressDefend = new Sprite(pressDefend_rect);
    pressDefend.interactive = true;
    pressDefend.buttonMode = true;
    pressDefend.position.set(GUIborder[0]+380, GUIborder[1]+620);
    pressDefend.width = 60;
    pressDefend.height = 60;
    pressDefend.on("click", ()=> {
        socket.emit("defend", {"allocated": 300.0});
    });
    GUI_component.addChild(pressDefend);

    var map = new Sprite(empty_rect);
    map.position.set(GUIborder[0]+790, GUIborder[1]+465);
    map.width = 410;
    map.height = 205;
    GUI_component.addChild(map);


    /************************************* TILEMAP ***************************************************************/


    var mapTextureMatrix = [ //default mapTextureMatrix (39x80 matrix <suitable for 15px>)
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,0,2,0,2,2,2,2,0,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,2,0,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2,0,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,0,2,2,0,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,2,0,0,0,2,0,2,2,2,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1,1,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,2,0,0,0,0,0,0,2,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,5,5,5,5,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,5,5,5,5,5,5,5,5,5,5,5,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,1,1,0,0,0,3,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,3,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,1,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,3,0,0,0,0,3,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,3,0,0,0,0,3,3,3,3,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,0,0,5,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,0,5,5,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,3,3,3,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,3,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,0,0,0,0,0,4,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,0,4,4,4,4,4,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0],
    ];

    var mapRegionMatrix = [ // 1 = North America, 2 = South America, 3 = Africa, 4 = Europe, 5 = Asia, 6 = Australia, 7 = Antarctica
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,5,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,1,0,0,1,1,0,0,0,4,0,0,4,0,4,4,4,4,0,4,4,4,4,4,4,4,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,5,5,5,5,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,4,0,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,5,0,5,5,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,4,4,4,4,0,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,5,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,4,4,4,0,4,4,0,4,4,4,4,4,4,4,5,5,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,5,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,4,0,0,0,4,0,4,4,4,0,5,5,5,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,5,0,0,5,5,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,4,0,0,0,0,0,0,4,0,5,5,5,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,5,0,5,5,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,3,3,3,3,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,5,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,5,5,5,5,5,5,5,5,5,0,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,5,5,5,5,5,5,5,0,0,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,5,5,5,5,5,5,5,0,0,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,5,5,5,5,5,0,0,0,0,5,5,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,5,5,5,5,5,5,5,0,0,5,5,5,0,0,0,5,5,0,0,0,6,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,5,5,5,5,5,5,0,0,0,0,5,5,0,0,0,0,5,5,0,0,6,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,5,5,0,5,0,0,0,0,0,5,0,0,0,0,0,0,5,0,6,0,0,0,0,6,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6,6,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,6,6,0,0,6,0,0,0,0,6,6,6,6,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,6,6,6,6,6,6,6,6,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,6,0,0,6,6,6,6,6,6,6,6,6,6,6,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,3,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,3,3,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,0,0,0,6,6,6,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,0,0,0,0,6,6,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,6,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,6,6,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,7,7,7,0,0,0,7,7,7,0,0,0,7,7,0,0,0,0,0,7,0,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,0,0,0,7,7,7,7,7,7,7,7,0,7,7,7,7,7,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0,0,0],
    ];

    function continentMapping(component, border, size, tint, dx, dy) {
        var column_counter = 0;
        var row_counter = 0;
        var columnEndPoint = Math.floor(585/size);
        var rowEndPoint = Math.floor(1200/size);

        for(var row of mapTextureMatrix.slice(0+dy, columnEndPoint+dy)) {
            for(var tile of row.slice(0+dx, rowEndPoint+dx)) {
                switch(tile) {
                    case 0:
                        var tile_texture = new Sprite(water_rect);
                        break;
                    case 1:
                        var tile_texture = new Sprite(ground_rect);
                        break;
                    case 2:
                        var tile_texture = new Sprite(grass_rect);
                        break;
                    case 3:
                        var tile_texture = new Sprite(sand_rect);
                        break;
                    case 4:
                        var tile_texture = new Sprite(ice_rect);
                        break;
                    case 5:
                        var tile_texture = new Sprite(dirt_rect);
                        break;
                }
                tile_texture.tint = tint;
                tile_texture.position.set(border[0] + size*column_counter, border[1] + size*row_counter);
                tile_texture.width = size;
                tile_texture.height = size;
                component.addChild(tile_texture);
                column_counter+=1;
            }
            column_counter = 0;
            row_counter+=1;
        }
    }
    continentMapping(TILEMAP_component, GUIborder, 60, 0xc4b5a6, 0, 0); // default game screen
    continentMapping(GUI_component, MAPborder, 5, 0x81848c, 0, 0); // default map screen

    TILEMAP_component.interactive = true;
    TILEMAP_component.buttonMode = true;

    function userInteraction() {
        window.zoomLevel = 60;
        window.dx = 0;
        window.dy = 0;

        // keyboard input
        window.addEventListener("keydown", function(event) {
            var columnEndPoint = Math.floor(585/zoomLevel);
            var rowEndPoint = Math.floor(1200/zoomLevel);
            var dxLimit = mapTextureMatrix[0].length-rowEndPoint;
            var dyLimit = mapTextureMatrix.length-columnEndPoint;
            switch(event.key) {
                case 'w':
                    (TILEMAP_component.children).length = 0;
                    dy-=1;
                    break;
                case 's':
                    (TILEMAP_component.children).length = 0;
                    dy+=1;
                    break;
                case 'a':
                    (TILEMAP_component.children).length = 0;
                    dx-=1;
                    break;
                case 'd':
                    (TILEMAP_component.children).length = 0;
                    dx+=1;
                    break;
                case 'q':
                    (TILEMAP_component.children).length = 0;
                    zoomLevel+=1;
                    break;
                case 'e':
                    (TILEMAP_component.children).length = 0;
                    zoomLevel-=1;
                    break;
            }
            if(dx >= dxLimit) { dx = dxLimit; }
            if(dx < 0 ) { dx = 0; }
            if(dy >= dyLimit) { dy = dyLimit; }
            if(dy < 0 ) { dy = 0; }
            if(zoomLevel >= 90) { zoomLevel=90; }
            if(zoomLevel <= 15) { zoomLevel=15; }

            continentMapping(TILEMAP_component, GUIborder, zoomLevel, 0xc4b5a6, dx, dy);
        });

        // mouse interaction
        window.addEventListener("click", function() {
            if(state == play && (mouseXY[0] != null && mouseXY[1] != null)) { // if mouse is out of tilemap, don't execute
                var continentNum = mapRegionMatrix[mouseXY[1]][mouseXY[0]];
            }

            // window.targetLocation;

            switch(continentNum) {
                case 0:
                    targetLocation = "Unclaimed";
                    break;
                case 1:
                    targetLocation = "NorthAmerica";
                    break;
                case 2:
                    targetLocation = "SouthAmerica";
                    break;
                case 3:
                    targetLocation = "Africa";
                    break;
                case 4:
                    targetLocation = "Europe";
                    break;
                case 5:
                    targetLocation = "Asia";
                    break;
                case 6:
                    targetLocation = "Australia";
                    break;
                case 7:
                    targetLocation = "Antarctica";
                    break;
            }
            event_broadcast.text = targetLocation;
        });
    }
    userInteraction();

    /********************************** preliminary setup for gameloop ************************************************************/

    window.state = mainMenu;

    app.stage.addChild(TILEMAP_component);
    app.stage.addChild(GUI_component);
    app.stage.addChild(MAIN_MENU_component);
    app.stage.addChild(ROOM_SELECT_component);
    app.stage.addChild(CONTINENT_SELECT_component);

    app.ticker.add(delta => gameLoop(delta, state));
}

/********************************** Game Loop *******************************************************************/
function gameLoop(delta, state) {
    state(delta, state);
}

function mainMenu(delta, state) {
    app.stage.children[0].visible = false; // prevent TILEMAP from rendering
    app.stage.children[1].visible = false; // prevent GUI from rendering
    app.stage.children[2].visible = true; // allow rendering mainMenu
    app.stage.children[3].visible = false; // prevent ROOM_SELECT from rendering
    app.stage.children[4].visible = false; // prevent CONTINENT_SELECT from rendering

    app.renderer.render(app.stage);
}

function roomSelect(delta, state) {
    app.stage.children[0].visible = false; // prevent TILEMAP from rendering
    app.stage.children[1].visible = false; // prevent GUI from rendering
    app.stage.children[2].visible = false; // prevent mainMenu from rendering
    app.stage.children[3].visible = true; // allow rendering ROOM_SELECT
    app.stage.children[4].visible = false; // prevent CONTINENT_SELECT from rendering
}

function continentSelect(data, state) {
    app.stage.children[0].visible = false; // prevent TILEMAP from rendering
    app.stage.children[1].visible = false; // prevent GUI from rendering
    app.stage.children[2].visible = false; // prevent mainMenu from rendering
    app.stage.children[3].visible = false; // prevent ROOM_SELECT from rendering
    app.stage.children[4].visible = true; // allow rendering CONTINENT_SELECT
}

function play(delta, state) {
    app.stage.children[0].visible = true; // allow rendering TILEMAP
    app.stage.children[1].visible = true; // allow rendering GUI
    app.stage.children[2].visible = false;// prevent mainMenu from rendering
    app.stage.children[3].visible = false; // prevent ROOM_SELECT from rendering
    app.stage.children[4].visible = false; // prevent CONTINENT_SELECT from rendering

    updateStats();
    updateTileSelection(state);
}


/******************************* Game Loop Methods **********************************************************************/
function updateStats() {
    gold_magnitude.text = gameState["money"];
    military_magnitude.text = gameState["troops"];
    agriculture_magnitude.text = gameState["resources"];
}

function updateTileSelection(state) {
    if(state == play) {
        var columnEndPoint = Math.floor(585/zoomLevel);
        var rowEndPoint = Math.floor(1200/zoomLevel);
        var x = Math.floor((app.renderer.plugins.interaction.mouse.global.x-40)/zoomLevel)+dx;
        var y = Math.floor((app.renderer.plugins.interaction.mouse.global.y-30)/zoomLevel)+dy;

        if(x > rowEndPoint+dx-1 || x < 0) { x=null; }
        if(y > columnEndPoint+dy-1 || y < 0) { y=null; }

        window.mouseXY = [x, y];
    }
}
