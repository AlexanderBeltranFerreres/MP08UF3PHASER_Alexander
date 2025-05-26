export default class gameOver extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        // Fons fosc
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        // Texts
        this.add.text(400, 200, 'GAME OVER', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 260, 'NICOTINA TOTAL: ' + this.finalScore, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Botó tornar a intentar
        const retryButton = this.add.text(400, 330, 'Torna a intentar', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5).setInteractive();
        retryButton.on('pointerdown', () => this.scene.start('primerMon'));
        retryButton.on('pointerover', () => retryButton.setStyle({ fill: '#ff0' }));
        retryButton.on('pointerout', () => retryButton.setStyle({ fill: '#0f0' }));

        // Botó tornar al menú
        const menuButton = this.add.text(400, 390, 'Torna al menú', { fontSize: '32px', fill: '#0ff' }).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('menuScene'));
        menuButton.on('pointerover', () => menuButton.setStyle({ fill: '#f0f' }));
        menuButton.on('pointerout', () => menuButton.setStyle({ fill: '#0ff' }));
    }
}
