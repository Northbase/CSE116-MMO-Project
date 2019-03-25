// https://stackoverflow.com/questions/4127991/grouping-shapes-and-text-in-html5-canvas
// https://www.htmlgoodies.com/html5/client/the-complete-guide-to-building-html5-games-with-canvas-svg.html
// https://github.com/kittykatattack/learningPixi#introduction
// http://www.pixijs.com/tutorials

//https://jayhant.com/honours-blog-9-eu4-map-modding-basics-what-i-had-in-2014-vs-what-i-have-now
// https://pixijs.io/examples/#/basics/basic.js

// http://www.html5gamedevs.com/topic/34168-rendering-only-in-screen-objects/

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
    var chat_rect = new Texture(GUI, new Rectangle(250, 0, 250, 250));
    var profile_rect = new Texture(GUI, new Rectangle(500, 0, 250, 250));
    var gold_stat_rect = new Texture(GUI, new Rectangle(750, 0, 250, 250));
    var military_stat_rect = new Texture(GUI, new Rectangle(1000, 0, 250, 250));
    var agriculture_stat_rect = new Texture(GUI, new Rectangle(1250, 0, 250, 250));

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

    var chat = new Sprite(chat_rect);
    chat.interactive = true;
    chat.buttonMode = true;
    chat.position.set(GUIborder[0]+380, GUIborder[1]+590);
    chat.width = 400;
    chat.height = 80;
    chat.on("click", ()=> {
        console.log("chat enabled")
    });
    GUI_component.addChild(chat);

    var map = new Sprite(map_rect);
    map.position.set(GUIborder[0]+790, GUIborder[1]+465);
    map.width = 410;
    map.height = 205;
    map.on("click", ()=> {
        console.log("map enabled")
    });
    GUI_component.addChild(map);


    /************************************* TILEMAP ***************************************************************/

    var mapMatrix = [ //default mapMatrix (39x80 matrix <suitable for 15px>)
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

    function continentMapping(component, border, size, tint, dx, dy) {
        var column_counter = 0;
        var row_counter = 0;
        var columnEndPoint = Math.floor(585/size);
        var rowEndPoint = Math.floor(1200/size);

        for(var row of mapMatrix.slice(0+dy, columnEndPoint+dy)) {
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
                // tile_texture.interactive = true;
                // tile_texture.buttonMode = true;
                tile_texture.tint = tint;
                tile_texture.position.set(border[0] + size*column_counter, border[1] + size*row_counter);
                tile_texture.width = size;
                tile_texture.height = size;
                tile_texture.name = [row_counter, column_counter];
                // console.log(tile_texture.name);
                component.addChild(tile_texture);
                column_counter+=1;
            }
            column_counter = 0;
            row_counter+=1;
        }
    }
    // continentMapping(TILEMAP_component, GUIborder, 15, 0xedebe6, 0, 0);
    continentMapping(TILEMAP_component, GUIborder, 60, 0xedebe6, 0, 0);

    continentMapping(GUI_component, MAPborder, 5, 0x9b9992, 0, 0);

    TILEMAP_component.interactive = true;
    TILEMAP_component.buttonMode = true;
    // TILEMAP_component.renderable = false;
    // TILEMAP_component.visible = false;

    function scrollMap() {
        var zoomLevel = 60;
        var dx = 0;
        var dy = 0;

        window.addEventListener("keydown", function(event) {
            var columnEndPoint = Math.floor(585/zoomLevel);
            var rowEndPoint = Math.floor(1200/zoomLevel);
            var dxLimit = mapMatrix[0].length-rowEndPoint;
            var dyLimit = mapMatrix.length-columnEndPoint;
            console.log(dx)
            switch(event.key) {
                case 'ArrowUp':
                    dy-=1;
                    break;
                case 'ArrowDown':
                    dy+=1;
                    break;
                case 'ArrowLeft':
                    dx-=1;
                    break;
                case 'ArrowRight':
                    dx+=1;
                    break;
                case 'q':
                    zoomLevel+=15;
                    break;
                case 'e':
                    zoomLevel-=15;
                    break;
            }
            if(dx >= dxLimit) { dx = dxLimit; }
            if(dx < 0 ) { dx = 0; }
            if(dy >= dyLimit) { dy = dyLimit; }
            if(dy < 0 ) { dy = 0; }
            if(zoomLevel >= 75) { zoomLevel=75; }
            if(zoomLevel <= 30) { zoomLevel=30; }

            continentMapping(TILEMAP_component, GUIborder, zoomLevel, 0xedebe6, dx, dy);

        });
    }
    scrollMap();

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
    // updateTileSelection();

    // state(delta, pause);
}

function pause(delta) {
    console.log("pasued");
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
    var x = Math.floor((app.renderer.plugins.interaction.mouse.global.x-40)/60);
    var y = Math.floor((app.renderer.plugins.interaction.mouse.global.y-30)/60);
    console.log([x,y]);
}
