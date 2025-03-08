class Menu extends Phaser.Scene{
    constructor() {
        super('menuScene')
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

        this.load.audio('giantRules', 'giant_spawn.m4a')
    }

    create() {
        this.add.text(gameWidth/2, gameHeight/2, 'Click to play').setOrigin(.5)

        this.input.on('pointerdown', () => {this.scene.start('playScene', {mouseX: 384, mouseY: 1952})})
        // this.input.on('pointerdown', () => {this.scene.start('giantScene')})
        // this.input.on('pointerdown', () => {this.scene.start('playScene', {mouseX: 3200, mouseY: 1952})})
    }
}