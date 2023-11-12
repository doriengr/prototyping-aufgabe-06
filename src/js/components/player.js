export default class Player {
    constructor() {
        this.player = document.querySelector('.player');
        this.container = document.querySelector('.sonar__container');
        this.speed = 10;

        const containerRadius = this.container.clientWidth / 2;
        this.playerX = containerRadius - this.player.clientWidth / 2;
        this.playerY = containerRadius - this.player.clientHeight / 2;
    }

    initPlayer() {
        this.addEventListener();
        this.updatePlayer();
    }

    addEventListener() {
        document.addEventListener('keydown', (e) => {
            const maxX = this.container.clientWidth - this.player.clientWidth;
            const maxY = this.container.clientHeight - this.player.clientHeight;
            const containerRadius = this.container.clientWidth / 2;

            switch (e.key) {
                case 'ArrowUp':
                    this.playerY = Math.max(this.playerY - this.speed, 0);
                    break;
                case 'ArrowDown':
                    this.playerY = Math.min(this.playerY + this.speed, maxY);
                    break;
                case 'ArrowLeft':
                    this.playerX = Math.max(this.playerX - this.speed, 0);
                    break;
                case 'ArrowRight':
                    this.playerX = Math.min(this.playerX + this.speed, maxX);
                    break;
            }

            const distanceFromCenter = Math.hypot(
                this.playerX + this.player.clientWidth / 2 - containerRadius,
                this.playerY + this.player.clientHeight / 2 - containerRadius
            );

            if (distanceFromCenter > containerRadius) {
                const angle = Math.atan2(
                    this.playerY + this.player.clientHeight / 2 - containerRadius,
                    this.playerX + this.player.clientWidth / 2 - containerRadius
                );
                this.playerX = containerRadius + containerRadius * Math.cos(angle) - this.player.clientWidth / 2;
                this.playerY = containerRadius + containerRadius * Math.sin(angle) - this.player.clientHeight / 2;
            }

            this.updatePlayer();
        });
    }

    updatePlayer() {
        this.player.style.left = this.playerX + 'px';
        this.player.style.top = this.playerY + 'px';
    }
}
