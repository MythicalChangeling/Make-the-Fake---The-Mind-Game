class Play extends Phaser.Scene{
    constructor() {
        super('playScene')
    }

    init() {
        this.tile = 36
        this.speed = 250
        this.jump = 500
        this.gravity = 1250
        this.physics.world.gravity.y = this.gravity
    }

    preload() {
        this.load.path = './assets/'

        this.load.image('tilesetImage', 'tilemap.png')
        this.load.tilemapTiledJSON('tilemapJSON', 'tilemap.json')
        this.load.spritesheet('mouse', 'mouse.png', {
            frameWidth: 192,
            frameHeight: 64
        })
    }

    create() {
        //tilemap
        this.map = this.add.tilemap('tilemapJSON')
        const tileset = this.map.addTilesetImage('theMindGameTilemap', 'tilesetImage')
        const skyLayer = this.map.createLayer('Sky', tileset, 0, 0)
        const treeLayer1 = this.map.createLayer('Trees 1', tileset, 0, 0)
        const treeLayer2 = this.map.createLayer('Trees 2', tileset, 0, 0)
        const groundLayer = this.map.createLayer('Ground', tileset, 0, 0)

        groundLayer.setCollisionByProperty({collides: true})
        treeLayer1.setScrollFactor(.8, 1)

        // add mouse
        this.mouse = this.physics.add.sprite(gameWidth/2 + 48, this.map.heightInPixels - 96, 'mouse', 0)
        this.mouse.body.setCollideWorldBounds(true)
        this.mouse.body.setSize(96, 64).setOffset(96, 0)

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.startFollow(this.mouse, true, .25, .25, -48)

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

        this.physics.add.collider(this.mouse, groundLayer)
    }

    update() {
        //right/left movement
        if (this.game.input.mousePointer.x > gameWidth/2 + 48) {
            this.mouse.setVelocityX(this.speed)
        }

        if (game.input.mousePointer.x < gameWidth/2 - 48) {
            this.mouse.setVelocityX(-this.speed)
        }

        //jump
        if ((game.input.mousePointer.y < gameHeight - this.tile*5 && this.mouse.y >= this.map.heightInPixels - this.tile*3) && !(game.input.mousePointer.x >= gameWidth - 5 || game.input.mousePointer.x <= 5 || game.input.mousePointer.y >= gameHeight - 5 || game.input.mousePointer.y <= 5)) {
            this.mouse.setVelocityY(-this.jump)
        }

        //climb
        

        //pause movement if the cursor leaves the game area
        if ((game.input.mousePointer.x > gameWidth/2 - 48 && this.game.input.mousePointer.x < gameWidth/2 + 48) || (game.input.mousePointer.x >= gameWidth - 5 || game.input.mousePointer.x <= 5 || game.input.mousePointer.y >= gameHeight - 5 || game.input.mousePointer.y <= 5)) {
            this.mouse.setVelocityX(0)
        }
    }
}