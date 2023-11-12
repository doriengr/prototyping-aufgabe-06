import Player from './components/player.js';
import Enemies from "./components/ships.js";
import Special from "./components/special.js";

const player = new Player();
const enemies = new Enemies();
const special = new Special();

let eliminatedCount = 0;
let countElement = document.querySelector('.eliminated__count');

let fuelCollisionStartTime = null;
let isFuelUpdateTriggered = false;
let lastFuelUpdateTime = 0;

let gameLost = false;
let startButton = document.querySelector('.start__button');
let soundPlaying = false;

init();

function checkCollision() {
    const playerRect = player.player.getBoundingClientRect();

    enemies.enemies.forEach(enemy => {
        const enemyRect = enemy.element.getBoundingClientRect();

        const collisionTolerance = 1;

        if (
            playerRect.right - collisionTolerance > enemyRect.left &&
            playerRect.left + collisionTolerance < enemyRect.right &&
            playerRect.bottom - collisionTolerance > enemyRect.top &&
            playerRect.top + collisionTolerance < enemyRect.bottom
        ) {
            enemies.removeEnemy(enemy);
            eliminatedCount++;
            countElement.innerHTML = eliminatedCount;
            fuelCollisionStartTime = null;
            enemies.playSoundOnRemoved();
        }
    });

}

function checkFuelLoading() {
    const fuelRect = special.fuelStation.getBoundingClientRect();
    const playerRect = player.player.getBoundingClientRect();

    if (
        playerRect.right > fuelRect.left &&
        playerRect.left < fuelRect.right &&
        playerRect.bottom > fuelRect.top &&
        playerRect.top < fuelRect.bottom
    ) {
        fuelCollisionStartTime === null
            ? fuelCollisionStartTime = new Date().getTime()
            : updateFuelStation(fuelCollisionStartTime);

        special.timerPaused = true;
    } else {
        fuelCollisionStartTime = null;
        isFuelUpdateTriggered = false;
        special.timerPaused = false;
    }
}

function updateFuelStation(fuelCollisionStartTime) {
    const currentTime = new Date().getTime();
    const currentCollisionDuration = currentTime - fuelCollisionStartTime;

    if (! isFuelUpdateTriggered) {
        if (currentCollisionDuration >= 3000 && currentTime - lastFuelUpdateTime >= 3000) {
            const powerUpsEarned = Math.floor(currentCollisionDuration / 3000);

            special.updateFuelCount(powerUpsEarned);
            isFuelUpdateTriggered = true;
            lastFuelUpdateTime = currentTime;
        }
    } else {
        if (currentTime - lastFuelUpdateTime >= 3000) {
            isFuelUpdateTriggered = false;
        }
    }
}

function checkingForGameLost() {
    if (! enemies.gameLost && ! special.gameLost) return;

    gameLost = true;
    special.lost();
    enemies.lost();
    const lost = document.querySelector('.lost');
    lost.classList.add('lost--show');
    if (! soundPlaying) {
        playLostSound();
    }
}

function playSound() {
    const audio = new Audio('/assets/atmo.wav');
    audio.loop = true;
    audio.play();
}

function playLostSound() {
    const audio = new Audio('/assets/lost.wav');
    audio.play();
    soundPlaying = true;
}

function init() {
    startButton.addEventListener('click', function() {
        let startScreen = document.querySelector('.start');
        startScreen.classList.remove('start--show');
        player.initPlayer();
        enemies.initEnemies();
        special.initSpecial();
        playSound();

        function loop() {
            checkCollision();
            checkFuelLoading();
            checkingForGameLost();
            requestAnimationFrame(loop);
        }

        loop();
    });
}
