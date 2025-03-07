//Evelyn Hald
//The Mind Game

'use strict'

let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    width: 896,
    height: 512,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        },
    },
    scene: [Menu, Play, Giant]
}

let game = new Phaser.Game(config)

let gameWidth = game.config.width
let gameHeight = game.config.height