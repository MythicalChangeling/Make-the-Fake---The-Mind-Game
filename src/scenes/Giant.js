class Giant extends Phaser.Scene{
    constructor() {
        super('giantScene')
    }

    init() {
        this.tile = 32
        this.speed = 250
        this.jump = 500
        this.gravity = 1250
        this.physics.world.gravity.y = this.gravity
    }
    
    create() {
        //tilemap
        this.map = this.add.tilemap('tilemapJSON')
        const tileset = this.map.addTilesetImage('theMindGameTilemap', 'tilesetImage')
        const skyLayer = this.map.createLayer('Sky', tileset, 0, 0)
        const gobletLayer = this.map.createLayer('Goblets', tileset, 0, 0)
        const groundLayer = this.map.createLayer('Ground', tileset, 0, 0)

        groundLayer.setCollisionByProperty({collides: true})

        // add mouse
        this.mouse = this.physics.add.sprite(this.tile*126, this.tile*13, 'mouse', 0)
        this.mouse.body.setCollideWorldBounds(true)
        this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(this.tile*3, 0)

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.centerOn(this.mouse.x, 0)

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

        this.physics.add.collider(this.mouse, groundLayer, () => {this.mouse.jump = false})

        //pointer setup
        this.pointer = this.input.activePointer
        this.pointer.worldX = this.mouse.x
        this.pointer.worldY = this.mouse.y
    }

    update() {
        //reset gravity and camera
        this.physics.world.gravity.y = this.gravity
        if (!this.mouse.jump) {
            // this.cameras.main.setFollowOffset(-this.tile*3/2, this.tile*5)
            // this.cameras.main.setLerp(0.25, .25)
        }
        // if (this.mouse.body.blocked.down) {
        //     // this.cameras.main.centerOnY(this.mouse.y - this.tile*5)
        // }
        // if (this.mouse.body.blocked.down) {
        //     this.mouse.jump = false
        // }
        
        //right/left movement
        if (this.pointer.worldX > this.mouse.x + this.tile*3) {
            this.mouse.setVelocityX(this.speed)
            this.pointer.worldX += this.speed
        }

        if (this.pointer.worldX < this.mouse.x) {
            this.mouse.setVelocityX(-this.speed)
            this.pointer.worldX -= this.speed
        }

        //jump
        if (this.pointer.worldY < this.mouse.y - this.tile*3 && this.mouse.body.blocked.down) {
            this.mouse.setVelocityY(-this.jump)
            this.mouse.jump = true
            this.cameras.main.setLerp(0.25, 0)
        }

        //climb setup
        if (this.mouse.body.blocked.right) {
            this.physics.world.gravity.y = 0
            this.mouse.setVelocityY(-this.speed)
            this.cameras.main.setFollowOffset(-this.tile*3/2, gameHeight/2 - this.tile*7)
        }

        //pause movement when hovering over the mouse
        if (this.pointer.worldX > this.mouse.x && this.pointer.worldX < this.mouse.x + this.tile*3) {
            this.mouse.setVelocityX(0)
        }

        //pause movement if the cursor leaves the game area
        if (!this.input.isOver) {
            this.mouse.setVelocityX(0)
            this.pointer.worldY = this.mouse.y
        }

        if (this.mouse.x < this.tile*115) {
            this.scene.start('playScene', {mouseX: this.mouse.x, mouseY: this.mouse.y})
        }
    }
}