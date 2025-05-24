import Phaser from 'phaser';
import menuScene from './scenes/menuScene.js';
import primerMon from './scenes/primerMon.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: [menuScene, primerMon]
};

new Phaser.Game(config);
