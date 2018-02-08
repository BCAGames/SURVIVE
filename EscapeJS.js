//asks for username
nametag = prompt("\"NEW UPDATE PRESS \"P\" FOR PAUSE \nPlease enter an appropriate user name:");

while (nametag == null || nametag == "" || nametag.length < 1 || nametag.length > 10){
    nametag = prompt("NEW UPDATE: PRESS \"P\" FOR PAUSE \n FULLSCREEN SUGGESTED \n Please enter a valid username that is no more than 10 characters:");
}


function getCookie(cookiename) {
    var name = cookiename + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function checkCookie() {
    var name = getCookie("username");
    if (name === nametag) {
        alert("Back for more, " + nametag + "?");
    } else {
        if (nametag != "" && nametag != null) {
            setCookie("username", nametag, 365);
        }
    }
}


// canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
var score = 0;

//key pressed
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var firePressed = false;
var prevKey = 'up';
var check_pause = 0;

// movement
var spd = 3;
var x = canvas.width/2;
var y = canvas.height/2;
var bx = x;
var by = y;
var dog = 250;

// features
var health = 40;
var level = 1;
var ax = getRandomInt(90, canvas.width-30);
var ay = getRandomInt(90, canvas.height-30);
var maxlevel = 20;
var timer = 0;
var hero_size = 1/5* canvas.height;


// spawn
var enemies = [];
var enemies_temp = [];
var bombs =[];
var bombs_temp = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//color array for enemies
var colorArray = [
    '#1f721f',
    '#41763b',
    '#57824b',
    '#395039',
    '#3b774d'
];

function setCookie(cookiename, val, expiration) {
    var d = new Date();
    d.setTime(d.getTime() + (expiration*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cookiename + "=" + val + ";" + expiration + ";path=/";
}

// give health
function giveHealth() {
    if (check_pause === 0) {
        if (health < 40) {
            health++;
        }
    }
}

// Checks if keys are pressed
function keyDownHandler(e) {
    if(e.keyCode === 68 || e.keyCode === 39) {
        rightPressed = true;
        prevKey = 'right';
    }
    else if(e.keyCode === 65 || e.keyCode === 37) {
        leftPressed = true;
        prevKey = 'left';
    }
    else if(e.keyCode === 87 || e.keyCode === 38) {
        upPressed = true;
        prevKey = 'up';
    }
    else if(e.keyCode === 83 || e.keyCode === 40) {
        downPressed = true;
        prevKey = 'down';
    }
    else if (e.keyCode === 80 || e.keyCode === 32) {
        firePressed = true;
    }
    if (e.keyCode === 80){

        if (check_pause === 0){

            check_pause += 1
        }
        else if (check_pause === 1){
            check_pause-=1;

        }
    }
}



// Checks if keys were released
function keyUpHandler(e) {
    if(e.keyCode === 68 || e.keyCode === 39) {
        rightPressed = false;
    }
    else if(e.keyCode === 65 || e.keyCode === 37) {
        leftPressed = false;
    }
    else if(e.keyCode === 87 || e.keyCode === 38) {
        upPressed = false;
    }
    else if(e.keyCode === 83 || e.keyCode === 40) {
        downPressed = false;
    }
    else if (e.keyCode === 80 || e.keyCode === 32) {
        firePressed = false;
    }
}

// Draws character
function charDraw() {
    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.fillRect(x, y, hero_size, hero_size);

    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    if (y - 50 < 0) {
        if (x - 10 < 0) {
            ctx.fillText(nametag, x + 50, y + 60);
        }
        else if (x + 50 > canvas.width) {
            ctx.fillText(nametag, x - 50, y + 60);
        }
        else if (x - 10 > 0 && x + 20 < canvas.width) {
            ctx.fillText(nametag, x + 15, y + 60);
        }
    }
    else if (x + 50 > canvas.width) {
        ctx.fillText(nametag, x - 50, y - 30);
    }
    else if (x - 10 < 0) {
        ctx.fillText(nametag, x + 50, y - 30);
    }
    else {
        ctx.fillText(nametag, x + 15, y - 30);
    }

}

// Random number generator
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


// enemy class
class Enemy {
    constructor(ex, ey) {
        this.x = ex;
        this.y = ey;
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)]
    }

    makeEnemy() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, hero_size, hero_size);
        if (check_pause === 0) {
            this.x += (x - this.x) / dog;
            this.y += (y - this.y) / dog;
        }
    }
}


//waves of enemies
function summonWaves() {
    if (check_pause === 0) {
        var wave = getRandomInt(3, 5);
        for (var j = 0; j < wave + 1; j++) {
            var ex = getRandomInt(0, canvas.width);
            var ey = getRandomInt(0, canvas.height);
            while ((ex > x-50&& ex<x+50)&&(ey > y -50 && ey <x+50)){
                ex = getRandomInt(0, canvas.width);
                ey = getRandomInt(0, canvas.height);
            }

            enemies.push(new Enemy(ex, ey));
            enemies_temp.push(new Enemy(ex, ey));
        }
    }
}


// update enemy position
function enemyUpdate(){
    for (k=0; k<enemies.length; k++) {
        enemies[k].makeEnemy();
    }
}


// remove "clouds"
function deleteThee() {
    if (check_pause === 0) {
        if (enemies.length > 40) {
            for (q = 0; q < 20; q++) {
                enemies.shift();
            }
        } else {
            for (q = 0; q < 4; q++) {
                enemies.shift();
            }
        }
    }
}


// health bar
function HealthBar() {
    if (health>0) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(x-5, y+40, health, 10);
    }
}


// Kill da doods
function EnemyKillRemove() {
    enemies_temp = enemies;
    for (g=0; g<enemies_temp.length; g++) {
        if ((Math.abs(enemies[g].x - x) < hero_size) && (Math.abs(enemies[g].y - y) < hero_size)) {
            enemies.splice(g, 1);
        }
    }
}


// Apple
function appleSpawn() {
    ctx.beginPath();
    ctx.fillStyle = '#e21638';
    ctx.fillRect(ax, ay + 10, hero_size, hero_size);

    if ((Math.abs(ax-x) < hero_size) && (Math.abs(ay-y) < hero_size)) {
        if (health < 40) {
            health ++;
        }

        score += 100;
        ax = getRandomInt(90, canvas.width-30);
        ay = getRandomInt(90, canvas.height-30);
    }
}


//score update
function scoreUpdate() {
    if (check_pause === 0) {
        score++;
    }
    ctx.font = "20px Impact";
    ctx.fillStyle = 'red';
    ctx.fillText("Score: " + score, 50, 60);
}


// draws game
function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    ctx.font = "20px Impact";
    ctx.fillStyle = 'red';
    ctx.fillText("Health: " + health, 50, 40);

    ctx.font = "20px Impact";
    ctx.fillStyle = 'red';
    ctx.fillText("Score: " + score, 50, 60);

    ctx.font = "20px Impact";
    ctx.fillStyle = 'red';
    ctx.fillText("Level: " + level, 50, 80);

    charDraw();
    enemyUpdate();
    EnemyKillRemove();
    HealthBar();
    appleSpawn();

    // Move left
    if (check_pause === 0) {
        if (leftPressed) {
            if (x - spd > 0) {
                x -= spd;
            }
        }

        // Move right
        if (rightPressed) {
            if (x + 30 + spd < canvas.width) {
                x += spd;
            }
        }

        // Move up
        if (upPressed) {
            if (y - spd > 0) {
                y -= spd;
            }
        }

        // Move down
        if (downPressed) {
            if (y + 30 + spd < canvas.height) {
                y += spd;
            }
        }
    }

    // Collision
    for (z=0; z < enemies_temp.length; z++) {
        if ((Math.abs(enemies[z].x - x) < hero_size) && (Math.abs(enemies[z].y - y) < hero_size)) {
            health = health - 0.5;
            enemies.shift();
        }
    }

    enemies_temp = enemies;

    if (health <= 0) {
        confirm("Your score was "+ score, "GLHF");
        health = 40;
        window.location.reload();
    }
}
var check_level = 15;
//Makes the game go faster
function levelmaker() {
    if (timer  === check_level) {
        if (level < maxlevel) {
            level+=1;
            dog *= 3.5 / 4;
            spd += .45;
            check_level += 15;
        }
        else {
            level = maxlevel;
        }
    }

    ctx.font = "20px Impact";
    ctx.fillStyle = 'blue';
    ctx.fillText("Level: " + level, 50, 80);
}

function timer_function() {
    if (check_pause === 0 ) {
        timer += 1;
        levelmaker()
    }
}

setInterval(timer_function,1000);
setInterval(draw, 10);
setInterval(scoreUpdate, 10);
setInterval(giveHealth, 5000);
setInterval(summonWaves, 500);
setInterval(deleteThee, 5000);


/*
+---------------------+
|  DEV LEADERBOARD:   |
+---------------------+
1. Nithin- 28200
2. Wiktor- 25000
3. Marvin - 19796
4.
 */
