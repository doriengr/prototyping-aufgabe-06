export default class Special {
    constructor() {
        this.fuelStation = document.querySelector('.fuel__station');

        this.timer = null;
        this.fuelCount = 60;
        this.fuelElement = document.querySelector('.fuel__wrapper');
        this.emptyFuel = 0;

        this.timerPaused = false;
        this.gameLost = false;
    }

    initSpecial() {
        this.timer = setInterval(() => this.updateTimer(), 1000);
        this.generateFuelStation();
    }

    updateTimer() {
        if (this.timerPaused || this.gameLost) return;


        this.fuelCount--;
        const currentFuel = this.fuelElement.children;

        if (this.fuelCount % 10 === 0 && currentFuel.length > 0 && this.emptyFuel <= 5) {
            currentFuel[this.emptyFuel].classList.add('empty');
            this.playSoundForEmptyBattery();
            this.emptyFuel++;
        }

        if (this.emptyFuel === 6) {
            this.lost();
        }
    }

    generateFuelStation() {
        const circleContainer = document.querySelector(".sonar__container");
        const circleRadius = circleContainer.offsetWidth / 2;

        const angle = Math.random() * 2 * Math.PI;

        const minDistance = 0.4 * circleRadius; // Adjust as needed
        const maxDistance = 0.9 * circleRadius;
        const spawnDistance = minDistance + Math.random() * (maxDistance - minDistance);

        const x = circleContainer.offsetWidth / 2 + spawnDistance * Math.cos(angle) - this.fuelStation.offsetWidth / 2;
        const y = circleContainer.offsetHeight / 2 + spawnDistance * Math.sin(angle) - this.fuelStation.offsetHeight / 2;

        this.fuelStation.style.left = `${x}px`;
        this.fuelStation.style.top = `${y}px`;
    }

    updateFuelCount() {
        if (this.fuelCount >= 51 || this.gameLost) return;

        this.fuelCount = this.fuelCount + 10;
        this.emptyFuel--;

        const emptyFuels = document.querySelectorAll('.fuel__item.empty');

        if (emptyFuels.length === 0) return;

        emptyFuels[emptyFuels.length - 1].classList.remove('empty');
        this.playSoundForUploadBattery();
    }

    playSoundForEmptyBattery() {
        if (this.gameLost) return;

        const audio = new Audio('/assets/low-battery.mp3');
        audio.volume = 0.2;
        audio.play();
    }

    playSoundForUploadBattery() {
        if (this.gameLost) return;

        const audio = new Audio('/assets/upload-battery.wav');
        audio.volume = 0.2;
        audio.play();
    }

    lost() {
        this.gameLost = true;
        clearInterval(this.timer);
    }
}