import Phaser from 'phaser';

export default class menuScene extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        this.add.text(400, 150, 'THE CEGARRO HUNTER', { fontSize: '55px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 200, 'By Alexander Beltran', { fontSize: '30px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 230, 'Joc Phaser MP08 UF3', { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);

        const startButton = this.add.text(400, 350, 'Jugar', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('primerMon');
        });
    }
}
