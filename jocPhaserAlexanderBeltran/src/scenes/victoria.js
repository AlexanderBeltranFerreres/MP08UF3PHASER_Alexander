import Phaser from 'phaser';

export default class victoria extends Phaser.Scene {
    constructor() {
        super('victoria');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Fons semi transparent fosc
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

        // Títol gran
        this.add.text(width / 2, height / 4, 'ENHORABONA!', {
            fontSize: '64px',
            fill: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Text humorístic curt
        this.add.text(width / 2, height / 2,
            "Espero que el camí de la victòria t’hagi sabut a glòria,\n" +
            "en sobredosi de nicotina i esquivant a l’Agència Tributària.\n" +
            "Ben fet, tito! 👍", {
                fontSize: '24px',
                fill: '#fff',
                align: 'center',
                wordWrap: { width: width * 0.7 }
            }).setOrigin(0.5);

        // Botó per tornar al menú principal
        const botoMenu = this.add.text(width / 2, height * 0.75, 'Tornar al Menú', {
            fontSize: '32px',
            backgroundColor: '#008800',
            padding: { x: 20, y: 10 },
            fill: '#fff',
            fontStyle: 'bold',
            stroke: '#004400',
            strokeThickness: 4,
            borderRadius: 5,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        botoMenu.on('pointerdown', () => {
            this.scene.start('menuScene');  // Canvia per el teu nom d'escena menú
        });

        // Efecte visual al passar el ratolí pel botó
        botoMenu.on('pointerover', () => {
            botoMenu.setStyle({ backgroundColor: '#00aa00' });
        });
        botoMenu.on('pointerout', () => {
            botoMenu.setStyle({ backgroundColor: '#008800' });
        });
    }
}
