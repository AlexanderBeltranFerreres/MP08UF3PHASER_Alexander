import Phaser from 'phaser';
import menuScene from './scenes/menuScene.js';
import primerMon from './scenes/primerMon.js';
import gameOver from './scenes/gameOver.js';
import segonMon from "./scenes/segonMon.js";
import vicotria from "./scenes/victoria.js";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,             // Ajusta automàticament al tamany de la finestra
        autoCenter: Phaser.Scale.CENTER_BOTH   // Centra el canvas
    },
    audio: {
        disableWebAudio: false,
        noAudio: false
    },
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: [menuScene, primerMon, gameOver, segonMon, vicotria],
    // plugins: {
    //     global: [{
    //         key: 'PhaserSound',
    //         plugin: Phaser.Sound.WebAudioSoundManager,
    //         mapping: 'sound',
    //         start: true
    //     }]
    // }
};

const game = new Phaser.Game(config);

// Redimensiona el joc quan la finestra canvia de mida
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
