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
        this.add.text(0, 0, 'click')

        this.input.on('pointerdown', () => {this.scene.start('giantScene', {mouseX: 3200, mouseY: 1952})})
    }
}