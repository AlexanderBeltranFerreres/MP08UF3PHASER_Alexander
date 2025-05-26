import Phaser from 'phaser';

export default class menuScene extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }
    preload() {
        this.load.audio('bgMusic', 'assets/audio/musicaFons.mp3');
    }

    create() {

        if (!this.sound.get('bgMusic')) {
            const music = this.sound.add('bgMusic', {
                loop: true,
                volume: 1
            });
            music.play();
            music.setLoop(true);
            music.config = { muteOnPause: false }; // Evita que es pari en pausa
        }

        // Fons sòlid que ocupa tota la pantalla
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x141e30);

        // Títol principal
        this.add.text(this.scale.width / 2, this.scale.height * 0.2, 'THE CEGARRO HUNTER', {
            fontFamily: 'Arial',
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#ffcc00',
            stroke: '#000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 5 }
        }).setOrigin(0.5);

        // Subtítols
        this.add.text(this.scale.width / 2, this.scale.height * 0.3, 'By Alexander Beltran', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#fff',
            fontStyle: 'italic',
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4 }
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height * 0.35, 'Joc Phaser MP08 UF3', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ccc',
            fontStyle: 'italic',
            shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 3 }
        }).setOrigin(0.5);

        // Funció per crear botons estilitzats
        const createButton = (y, text, baseColor, hoverColor, callback) => {
            const btn = this.add.text(this.scale.width / 2, y, text, {
                fontFamily: 'Arial',
                fontSize: '34px',
                color: baseColor,
                backgroundColor: '#222',
                padding: { x: 25, y: 15 },
                stroke: '#000',
                strokeThickness: 3,
                shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 5 },
                borderRadius: 10,
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => {
                btn.setStyle({ backgroundColor: hoverColor, color: '#fff' });
                this.tweens.add({ targets: btn, scale: 1.1, duration: 150, ease: 'Power1' });
            });
            btn.on('pointerout', () => {
                btn.setStyle({ backgroundColor: '#222', color: baseColor });
                this.tweens.add({ targets: btn, scale: 1, duration: 150, ease: 'Power1' });
            });
            btn.on('pointerdown', callback);
            return btn;
        };

        createButton(this.scale.height * 0.5, 'NIVELL 1', '#00cc00', '#33ff33', () => this.scene.start('primerMon'));
        createButton(this.scale.height * 0.6, 'NIVELL 2', '#ff9900', '#ffbb33', () => this.scene.start('segonMon'));
    }
}
