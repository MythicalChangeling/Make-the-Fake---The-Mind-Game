//Evelyn Hald
//The Mind Game from "Ender's Game"

//Major Phaser Components: Physics, Animation, Tweens, Timers, Tilemap
//Polish and Style: Use of parallax in the background, controls by moving the mouse rather than keyboard inputs to mimic the mind controls from the movie, choice to include dialogue from the movie at the game's end to reflect the game's narrative impact

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
    scene: [Instruct, Menu, Play, Giant]
}

let game = new Phaser.Game(config)

let gameWidth = game.config.width
let gameHeight = game.config.height
let giantShown = false