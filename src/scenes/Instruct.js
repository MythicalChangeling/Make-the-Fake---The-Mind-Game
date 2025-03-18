class Instruct extends Phaser.Scene{
    constructor() {
        super('instructScene')
    }

    preload() {
        this.load.path = './assets/'

        this.load.image('tilesetImage', 'tilemap.png')
        this.load.tilemapTiledJSON('tilemapJSON', 'tilemap.json')
        this.load.spritesheet('mouse', 'mouse.png', {
            frameWidth: 192,
            frameHeight: 64
        })
        this.load.image('giant', 'giant.png')
        this.load.image('giant_fog', 'giant_fog.png')
        this.load.image('black_screen', 'black_screen.png')
        this.load.image('title', 'title.png')
        this.load.image('title_fade', 'title_fade.png')
        this.load.image('icon', 'icon.png')

        this.load.audio('giantRules', 'giant_spawn.m4a')
        this.load.audio('giant_death', 'giant_death.m4a')
        this.load.audio('mouse_death', 'mouse_death.m4a')
    }

    create() {
        this.add.text(gameWidth/2, gameHeight/2 - 20, 'Use the mouse to control').setOrigin(.5)
        this.add.text(gameWidth/2, gameHeight/2, 'Click to play').setOrigin(.5)
        this.add.text(15, gameHeight - 55, 'Made by Evelyn Hald').setOrigin(0)
        this.add.text(15, gameHeight - 30, `Based on the Mind Game from "Ender's Game"`).setOrigin(0)

        this.input.on('pointerdown', () => {this.scene.start('menuScene')})
    }
}