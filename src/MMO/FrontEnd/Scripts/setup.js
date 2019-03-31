// https://stackoverflow.com/questions/4127991/grouping-shapes-and-text-in-html5-canvas
// https://www.htmlgoodies.com/html5/client/the-complete-guide-to-building-html5-games-with-canvas-svg.html
// https://github.com/kittykatattack/learningPixi#introduction
// http://www.pixijs.com/tutorials

//https://jayhant.com/honours-blog-9-eu4-map-modding-basics-what-i-had-in-2014-vs-what-i-have-now
// https://pixijs.io/examples/#/basics/basic.js

// http://www.html5gamedevs.com/topic/34168-rendering-only-in-screen-objects/

// let $ = require("jquery")

var Application = PIXI.Application;
var Container = PIXI.Container;
var Sprite = PIXI.Sprite;
var TextureCache = PIXI.utils.TextureCache;
var Rectangle = PIXI.Rectangle;
var Texture = PIXI.Texture;
var Text = PIXI.Text;
var loader = PIXI.loader;
var resources = PIXI.loader.resources;

var app = new Application({
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

function setup() {

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * **
    * SCREEN SIZE                                               *
    * screen = 1280x720 px <1px-based> 1280x720 tiles           *
    * game = 1200x585 px <15px-based> 80x39 tiles               *
    * map = 400x195 px <5px-based>  80x39 tiles                 *
    ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    var GUIborder = [40, 30]; //40px horizontal gap; 30px vertical gap (from top left corner)
    var MAPborder = [835, 500]; //870 px horizontal gap; 490px veritcal gap (from top left corner)

    var tilemap = TextureCache["textures/tilemap.png"];
    var sand_rect = new Texture(tilemap, new Rectangle(0, 0, 250, 250));
    var grass_rect = new Texture(tilemap, new Rectangle(250, 0, 250, 250));
    var water_rect = new Texture(tilemap, new Rectangle(500, 0, 250, 250));
    var ground_rect = new Texture(tilemap, new Rectangle(750, 0, 250, 250));
    var ice_rect = new Texture(tilemap, new Rectangle(1000, 0, 250, 250));
    var dirt_rect = new Texture(tilemap, new Rectangle(1250, 0, 250, 250));

    var empty_rect = new Texture(tilemap, new Rectangle(0, 250, 250, 250));

    var GUI = TextureCache["textures/GUI.png"];
    var map_rect = new Texture(GUI, new Rectangle(0, 0, 250, 250));
    var eventBox_rect = new Texture(GUI, new Rectangle(250, 0, 250, 250));
    var profile_rect = new Texture(GUI, new Rectangle(500, 0, 250, 250));
    var gold_stat_rect = new Texture(GUI, new Rectangle(750, 0, 250, 250));
    var military_stat_rect = new Texture(GUI, new Rectangle(1000, 0, 250, 250));
    var agriculture_stat_rect = new Texture(GUI, new Rectangle(1250, 0, 250, 250));
    var pressAttack_rect = new Texture(GUI, new Rectangle(1500, 0, 250, 250));
    var pressDefend_rect = new Texture(GUI, new Rectangle(1750, 0, 250, 250));


    var TILEMAP_component = new Container();
    var GUI_component = new Container();

    /************************************* GUI ***************************************************************/

    window.goldQauntity = 0; // global variable
    window.militaryQauntity = 0;
    window.agricultureQauntity = 0;

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

    window.gold_magnitude = new Text(goldQauntity);
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

    window.military_magnitude = new Text(militaryQauntity);
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

    window.agriculture_magnitude = new Text(agricultureQauntity);
    agriculture_magnitude.position.set(GUIborder[0]+290, GUIborder[1]+650);
    agriculture_magnitude.style.fill = 0x000000;
    agriculture_magnitude.style.fontSize = 15;
    agriculture_magnitude.style.fontFamily = "Times New Roman";
    GUI_component.addChild(agriculture_magnitude);

    var eventBox = new Sprite(eventBox_rect);
    eventBox.interactive = true;
    eventBox.buttonMode = true;
    eventBox.position.set(GUIborder[0]+445, GUIborder[1]+560);
    eventBox.width =  335;
    eventBox.height = 120;
    // eventBox.on("click", ()=> {
    //    $.get("index.css", function(data) {
    //       console.log(data);
    //    });
    // });
    GUI_component.addChild(eventBox);

    window.event_broadcast = new Text("");
    event_broadcast.position.set(GUIborder[0]+445, GUIborder[1]+565);
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
        console.log("Attack")
    });
    GUI_component.addChild(pressAttack);

    var pressDefend = new Sprite(pressDefend_rect);
    pressDefend.interactive = true;
    pressDefend.buttonMode = true;
    pressDefend.position.set(GUIborder[0]+380, GUIborder[1]+620);
    pressDefend.width = 60;
    pressDefend.height = 60;
    pressDefend.on("click", ()=> {
        console.log("Defend")
    });
    GUI_component.addChild(pressDefend);


    var map = new Sprite(map_rect);
    map.position.set(GUIborder[0]+790, GUIborder[1]+465);
    map.width = 410;
    map.height = 205;
    map.on("click", ()=> {
        console.log("map enabled")
    });
    GUI_component.addChild(map);


    /************************************* TILEMAP ***************************************************************/


    var mapTextureMatrix = [ //default mapTextureMatrix (39x80 matrix <suitable for 15px>) [texture, r]
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
    continentMapping(TILEMAP_component, GUIborder, 60, 0xedebe6, 0, 0); // default game screen
    continentMapping(GUI_component, MAPborder, 5, 0x9b9992, 0, 0); // default map screen

    TILEMAP_component.interactive = true;
    TILEMAP_component.buttonMode = true;
    // TILEMAP_component.renderable = false;
    // TILEMAP_component.visible = false;

    // GUI_component.destroy();

    function userInteraction() {
        window.zoomLevel = 60;
        window.dx = 0;
        window.dy = 0;

        window.addEventListener("keydown", function(event) { // keyboard interaction
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
            if(zoomLevel >= 75) { zoomLevel=75; }
            if(zoomLevel <= 15) { zoomLevel=15; }

            continentMapping(TILEMAP_component, GUIborder, zoomLevel, 0xedebe6, dx, dy);
        });

        window.addEventListener("click", function() { // mouse interaction
            if(mouseXY[0] != null && mouseXY[1] != null) { // if mouse is out of tilemap, don't execute
                var continentNum = mapRegionMatrix[mouseXY[1]][mouseXY[0]];
            }
            var regionInfo = {
                "continent": ""
            };
            switch(continentNum) {
                case 0:
                    regionInfo.continent = "Unclaimed";
                    break;
                case 1:
                    regionInfo.continent = "North America";
                    break;
                case 2:
                    regionInfo.continent = "South America";
                    break;
                case 3:
                    regionInfo.continent = "Africa";
                    break;
                case 4:
                    regionInfo.continent = "Europe";
                    break;
                case 5:
                    regionInfo.continent = "Asia";
                    break;
                case 6:
                    regionInfo.continent = "Australia";
                    break;
                case 7:
                    regionInfo.continent = "Antarctica";
                    break;
            }
            event_broadcast.text = regionInfo.continent;
        });
    }

    userInteraction();

    /********************************** preliminary setup for gameloop ************************************************************/
    var state = play; // initial state is "play"

    app.stage.addChild(TILEMAP_component)
    app.stage.addChild(GUI_component);
    app.renderer.render(app.stage); // render the stage components


    app.ticker.add(delta => gameLoop(delta, state));
};



/********************************** Game Loop *******************************************************************/
function gameLoop(delta, state) {
    state(delta, state);
};

function play(delta, state) {
    // updateStats();
    updateTileSelection();

    // state(delta, pause);
}

function pause(delta) {
    console.log("paused");
}

/******************************* Game Loop Methods **********************************************************************/
function updateStats() {
    goldQauntity+=1;
    militaryQauntity+=1;
    agricultureQauntity+=1;

    gold_magnitude.text = goldQauntity;
    military_magnitude.text = militaryQauntity;
    agriculture_magnitude.text = agricultureQauntity;
}

function updateTileSelection() {
    var columnEndPoint = Math.floor(585/zoomLevel);
    var rowEndPoint = Math.floor(1200/zoomLevel);
    var x = Math.floor((app.renderer.plugins.interaction.mouse.global.x-40)/zoomLevel)+dx;
    var y = Math.floor((app.renderer.plugins.interaction.mouse.global.y-30)/zoomLevel)+dy;

    if(x > rowEndPoint+dx-1 || x < 0) { x=null; }
    if(y > columnEndPoint+dy-1 || y < 0) { y=null; }

    window.mouseXY = [x, y];
}
