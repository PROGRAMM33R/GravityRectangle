/*
 * author: Adam Lasak
 * website: www.adam-lasak.xf.cz
 * email: lasak.ad@gmail.com
 * copyright 2016
 */

var keys = [], scoreArray = [], movingUp = false, gameOver = false;
var obstaclesSpeed = 1, generateFrequency = 150, changingFrequency = false, speedUp = 0.9;

var rectComponents = {

    "redRectangle": {},
    "obstacles": []

};


function startGame(){

    GameArea.start();
    rectComponents.redRectangle = new rectComponent(25, 25, "red", 30, GameArea.canvas.height / 2 );

}

var GameArea = {

    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.scoreNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function(gameOver){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    gameOver : function(){
        ctx.font = "50px Arial";
        ctx.fillStyle = "gray";
        ctx.fillText("GAME OVER", 80, this.canvas.height / 2);
    },
    score : function(){
        ctx.font = "10px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText("SCORE: " + this.scoreNo, this.canvas.width - 85, 15);
    },
    stop : function() {
        clearInterval(this.interval);
    }

};

function everyInterval(n){

    if (( GameArea.frameNo / n ) % 1 == 0)
        return true;
    return false;

}

function rectComponent(width, height, color, x, y) {

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0.0;
    this.speedY = 0.0;
    this.update = function(){
        ctx = GameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.x += this.speedX;
        this.y += this.speedY;

        if (rectComponents.redRectangle.y < 0){
            this.y = 0;
            this.speedY = 0.0;
        }
        if (rectComponents.redRectangle.y > GameArea.canvas.height - 27){
            this.y = GameArea.canvas.height - 27;
            this.speedY = 0.0;
            falling = false;
        }
        if (rectComponents.redRectangle.x < 0){
            this.x = 0;
            this.speedX = 0.0;
        }
        if (rectComponents.redRectangle.x > GameArea.canvas.width - 25){
            this.x = GameArea.canvas.width - 25;
        }   

    }
    this.crashWith = function(otherObj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherObj.x;
        var otherright = otherObj.x + (otherObj.width);
        var othertop = otherObj.y;
        var otherbottom = otherObj.y + (otherObj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }

}

function updateGameArea(){
	
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    if (GameArea.scoreNo == 100){
        obstaclesSpeed += 0.1;
        generateFrequency = 100;
        changingFrequency = true;
    }
    else if (GameArea.scoreNo == 200){
        obstaclesSpeed += 0.2;
        generateFrequency = 50;
        changingFrequency = true;
        speedUp = 1.3;
    }
    else if (GameArea.scoreNo == 300){
        obstaclesSpeed += 0.2;
        generateFrequency = 30;
        changingFrequency = true;
        speedUp = 1.6;
    }

    for (var i = 0; i < rectComponents.obstacles.length; i++){
        if (rectComponents.redRectangle.crashWith( rectComponents.obstacles[i] )){
            gameOver = true;
            GameArea.stop();
            GameArea.gameOver();

            if (scoreArray.length == 0)
                document.getElementById("highest-score").innerHTML = "Highest score: " + GameArea.scoreNo;
            else {
                var maxScore = Math.max.apply(null, scoreArray);
                if (GameArea.scoreNo > maxScore)
                    document.getElementById("highest-score").innerHTML = "Highest score: " + GameArea.scoreNo;  
            }
            scoreArray.push( parseInt(GameArea.scoreNo) );

            return;
        }
    }
    
    GameArea.clear();
    GameArea.frameNo += 1;

    if (GameArea.scoreNo == 0 || everyInterval(10))
        GameArea.scoreNo += 1;

    if (GameArea.frameNo == 1 || everyInterval(generateFrequency) && !changingFrequency) {
        x = GameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        rectComponents.obstacles.push(new rectComponent(10, height, "green", x, 0));
        rectComponents.obstacles.push(new rectComponent(10, x - height - gap, "green", x, height + gap));
    } else {
        changingFrequency = false;
    }

    for (var i = 0; i < rectComponents.obstacles.length; i++){
        rectComponents.obstacles[i].x -= obstaclesSpeed;
        rectComponents.obstacles[i].update();
    }
    
    rectComponents.redRectangle.update();
    GameArea.score();

    rectComponents.redRectangle.speedX *= 0.97;
    
    if (!movingUp)
        rectComponents.redRectangle.speedY += 0.1;

}

function keyDown(e){

    keys[e.keyCode] = true;

    if (keys[38]){ // up
        if (rectComponents.redRectangle.speedY > 0)
            rectComponents.redRectangle.speedY = 0;
        rectComponents.redRectangle.speedY -= speedUp;
        movingUp = true;
    }

    if (keys[40]){ // down
        if (rectComponents.redRectangle.speedY < 0)
            rectComponents.redRectangle.speedY = 0;
        rectComponents.redRectangle.speedY += 1.6;
    }

    if (keys[37]){ // left
        if (rectComponents.redRectangle.speedX >= -1.5){
            if (rectComponents.redRectangle.speedX > 0)
                rectComponents.redRectangle.speedX = 0;
            rectComponents.redRectangle.speedX -= 0.3;
        }
    }

    if (keys[39]){ // right
        if (rectComponents.redRectangle.speedX <= 1.5){
            if (rectComponents.redRectangle.speedX < 0)
                rectComponents.redRectangle.speedX = 0;
            rectComponents.redRectangle.speedX += 0.3;
        }
    }

    if (keys[27]){ // ESC - restart game

        if (gameOver){

            obstaclesSpeed = 1;
            generateFrequency = 150;
            changingFrequency = false;
            speedUp = 0.9;

            rectComponents = {
                "redRectangle": {},
                "obstacles": []
            };

            startGame();
        }

        gameOver = false;

    }
    
}

function keyUp(e){

    if (keys[e.keyCode])
        movingUp = false;
    keys[e.keyCode] = false;

}

window.addEventListener('keydown', keyDown, false);
window.addEventListener('keyup', keyUp, false);