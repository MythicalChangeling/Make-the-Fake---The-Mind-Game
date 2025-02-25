//Evelyn Hald
//The Mind Game

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 900,
    height: 550,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true
        },
    },
    scene: [Menu]
}

let game = new Phaser.Game(config)

let gameWidth = game.config.width
let gameHeight = game.config.height