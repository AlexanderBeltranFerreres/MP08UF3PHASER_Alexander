import Phaser from 'phaser';

export default class gameOver extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        // Fons fosc que ocupa tota la pantalla, amb opacitat
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.7);

        // Texts centrats i posicionats segons mida pantalla
        this.add.text(this.scale.width / 2, this.scale.height * 0.3, 'GAME OVER', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(this.scale.width / 2, this.scale.height * 0.4, 'NICOTINA TOTAL: ' + this.finalScore, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Botó tornar a intentar
        const retryButton = this.add.text(this.scale.width / 2, this.scale.height * 0.5, 'Torna a intentar', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5).setInteractive();
        retryButton.on('pointerdown', () => this.scene.start('primerMon'));
        retryButton.on('pointerover', () => retryButton.setStyle({ fill: '#ff0' }));
        retryButton.on('pointerout', () => retryButton.setStyle({ fill: '#0f0' }));

        // Botó tornar al menú
        const menuButton = this.add.text(this.scale.width / 2, this.scale.height * 0.6, 'Torna al menú', { fontSize: '32px', fill: '#0ff' }).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('menuScene'));
        menuButton.on('pointerover', () => menuButton.setStyle({ fill: '#f0f' }));
        menuButton.on('pointerout', () => menuButton.setStyle({ fill: '#0ff' }));
    }
}
