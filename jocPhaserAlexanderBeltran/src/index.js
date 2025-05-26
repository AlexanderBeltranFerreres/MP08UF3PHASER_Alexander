import Phaser from 'phaser';
import menuScene from './scenes/menuScene.js';
import primerMon from './scenes/primerMon.js';
import gameOver from './scenes/gameOver.js';
import segonMon from "./scenes/segonMon.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,         // Escala per ajustar a la finestra
        autoCenter: Phaser.Scale.CENTER_BOTH // Centra automàticament
    },
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: [menuScene, primerMon, gameOver, segonMon]
};

new Phaser.Game(config);
