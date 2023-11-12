export default class Enemies {
    constructor() {
        this.enemiesContainer = document.querySelector(".ship__container");
        this.enemies = [];
        this.spawnInterval = 2000;
        this.livesCount = 3;
        this.livesWrapper = document.querySelector('.lives___wrapper');
        this.gameLost = false;
        this.interval = null;
    }

    initEnemies() {
        this.animate();

        // Set up interval to spawn new enemies every 5 seconds
        this.interval = setInterval(() => {
            this.generateRandomElements();
        }, this.spawnInterval);
    }

    generateRandomElements() {
        const circleContainer = document.querySelector(".sonar__container");
        const circleRadius = circleContainer.offsetWidth / 2;

        const enemy = document.createElement("div");
        enemy.classList.add("enemy");

        const angle = Math.random() * 2 * Math.PI;
        const spawnDistance = 0.9 * circleRadius;

        const x = circleContainer.offsetWidth / 2 + spawnDistance * Math.cos(angle) - enemy.offsetWidth / 2;
        const y = circleContainer.offsetHeight / 2 + spawnDistance * Math.sin(angle) - enemy.offsetHeight / 2;

        enemy.style.left = `${x}px`;
        enemy.style.top = `${y}px`;

        this.enemiesContainer.appendChild(enemy);

        const speedX = (circleContainer.offsetWidth / 2 - x) / 500;
        const speedY = (circleContainer.offsetHeight / 2 - y) / 500;

        this.playSoundOnCreate();

        this.enemies.push({
            element: enemy,
            speedX: speedX,
            speedY: speedY,
        });
    }

    animate() {
        this.enemies.forEach(enemy => {
            const { element, speedX, speedY } = enemy;

            let x = parseFloat(element.style.left);
            let y = parseFloat(element.style.top);

            x += speedX;
            y += speedY;

            const circleContainerWidth = this.enemiesContainer.offsetWidth;
            const circleContainerHeight = this.enemiesContainer.offsetHeight;
            const circleRadius = circleContainerWidth / 2;

            const distanceFromCenter = Math.sqrt((x - circleContainerWidth / 2) ** 2 + (y - circleContainerHeight / 2) ** 2);

            if (distanceFromCenter < 10) {
                this.removeEnemy(enemy);
                this.reduceOneLive();
            }

            if (distanceFromCenter + element.offsetWidth / 2 > circleRadius) {
                element.remove();
                this.enemies = this.enemies.filter(e => e.element !== element);
            } else {
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    reduceOneLive() {
        const currentIcons = this.livesWrapper.children;

        if (this.livesCount > 1) {
            this.livesCount--;
            this.playSoundOnLiveRemoved();

            if (currentIcons.length > 0) {
                this.livesWrapper.removeChild(currentIcons[currentIcons.length - 1]);
            }
        } else {
            this.lost();
            this.livesCount--;
            this.livesWrapper.removeChild(currentIcons[currentIcons.length - 1]);
        }
    }

    lost() {
        this.gameLost = true;
        clearInterval(this.interval);
        this.enemies = [];
    }

    removeEnemy(enemy) {
        enemy.element.remove();
        this.enemies = this.enemies.filter(e => e !== enemy);
    }

    playSoundOnCreate() {
        const audio = new Audio('/assets/ship.wav');
        audio.volume = 0.1;
        audio.play();
    }

    playSoundOnRemoved() {
        const audio = new Audio('/assets/killed-enemy.wav');
        audio.play();
    }

    playSoundOnLiveRemoved() {
        const audio = new Audio('/assets/lost-one-heart.wav');
        audio.play();
    }
}
