/*
 * author: Adam Lasak
 * website: www.adam-lasak.xf.cz
 * email: lasak.ad@gmail.com
 * copyright 2016
 */


var rectComponents = {

	"redRectangle": {}

};


function startGame(){

    GameArea.start();
    rectComponents.redRectangle = new rectComponent(25, 25, "red", 30, (GameArea.canvas.height / 2 - 25) );

}

var GameArea = {

    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

};

function rectComponent(width, height, color, x, y) {

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = GameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

function updateGameArea(){

	GameArea.clear();
	//rectComponents.redRectangle.x += 1;
	rectComponents.redRectangle.update();

}