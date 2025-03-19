class Play extends Phaser.Scene{
    constructor() {
        super('playScene')
    }

    init(loaction) {
        this.mouseX = loaction.mouseX
        this.mouseY = loaction.mouseY

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
        const bushesLayer = this.map.createLayer('Bushes', tileset, 0, 0)
        const treeLayer1 = this.map.createLayer('Trees 1', tileset, 0, 0)
        const treeLayer2 = this.map.createLayer('Trees 2', tileset, 0, 0)

        //add giant if present
        if (giantShown) {
            this.giant = this.add.image(this.tile*140, this.tile*8, 'giant')
        }
        this.add.image(this.tile*140, this.tile*8, 'giant_fog')
        
        const gobletLayer = this.map.createLayer('Goblets', tileset, 0, 0)
        const groundLayer = this.map.createLayer('Ground', tileset, 0, 0)
        const rootsLayer = this.map.createLayer('Roots', tileset, 0, 0)

        //collision and parallax
        groundLayer.setCollisionByProperty({collides: true})
        rootsLayer.setCollisionByProperty({collides: true})
        bushesLayer.setScrollFactor(.6, 1)
        treeLayer1.setScrollFactor(.8, 1)

        // add mouse
        this.mouse = this.physics.add.sprite(this.mouseX, this.mouseY, 'mouse', 4)
        this.mouse.body.setCollideWorldBounds(true, 0, .5)
        this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(this.tile*3, 0)
        this.mouse.anims.create({
            key: 'mouse_run',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('mouse', {start: 0, end: 3})
        })
        this.mouse.anims.create({
            key: 'mouse_jump',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('mouse', {frames: [2, 3, 0]})
        })
        this.mouse.anims.create({
            key: 'mouse_climb',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('mouse', {frames: [0, 1, 2, 2, 3]})
        })

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.startFollow(this.mouse, true, .25, .25, -this.tile*3/2)

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

        this.physics.add.collider(this.mouse, groundLayer, () => {this.mouse.jump = false, this.mouse.canClimb = true, this.mouse.rootsCollide = false})
        this.physics.add.collider(this.mouse, rootsLayer, () => {this.mouse.jump = false, this.mouse.canClimb = false, this.mouse.rootsCollide = true})

        //wind sound (check to make sure it's not already playing from the giant scene)
        if (!windy) {
            this.wind = this.sound.add('wind', {loop: true})
            this.wind.play()
            windy = true
        }

        //pointer setup
        this.pointer = this.input.activePointer
        this.pointer.worldX = this.mouse.x
        this.pointer.worldY = this.mouse.y

        //transition
        this.transition = this.add.image(gameWidth/2, this.map.heightInPixels - gameHeight/2, 'title_fade')
        this.tweens.add({
            targets: this.transition,
            scale: 2,
            alpha: 0,
            duration: 200
        })
    }

    update() {
        //reset gravity, camera, and mouse rotation when needed
        this.physics.world.gravity.y = this.gravity
        if (!this.mouse.jump && !this.mouse.rootsCollide) {
            this.cameras.main.setFollowOffset(-this.tile*3/2, this.tile*5)
            this.cameras.main.setLerp(0.25, .25)
        }
        if (this.mouse.body.blocked.down || this.mouse.y < this.tile*13) {
            this.mouse.angle = 0
            this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(this.tile*3, 0)
        }
        this.mouse.climbing = false
        
        //climb setup
        if (this.mouse.body.blocked.right && this.mouse.canClimb) {
            this.mouse.angle = -90
            this.mouse.body.setSize(this.tile*2, this.tile*3).setOffset(this.tile*2, -this.tile*2)
            this.mouse.climbing = true
            this.mouse.anims.play('mouse_climb', true)
            this.physics.world.gravity.y = 0
            this.mouse.setVelocityY(-this.speed*1.5)
            this.cameras.main.setFollowOffset(-this.tile*3/2, gameHeight/2 - this.tile*7)
        }

        //jump
        if (this.pointer.worldY < this.mouse.y - this.tile*3 && !this.mouse.jump && !this.mouse.climbing && this.mouse.body.blocked.down) {
            this.mouse.anims.play('mouse_jump', true)
            this.mouse.jump = true
            this.mouse.on('animationcomplete', () => {
                this.mouse.setVelocityY(-this.jump)
                this.cameras.main.setLerp(0.25, 0)
            })
        }

        //right/left movement
        if (this.pointer.worldX > this.mouse.x + this.tile*3) {
            if (!this.mouse.jump && !this.mouse.climbing) {
                this.mouse.anims.play('mouse_run', true)
            }
            if (this.mouse.body.blocked.down) {
                this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(this.tile*3, 0)
            }
            this.mouse.setFlipX(false)
            this.mouse.setVelocityX(this.speed)
            this.pointer.worldX += this.speed
        }

        if (this.pointer.worldX < this.mouse.x) {
            if (!this.mouse.jump) {
                this.mouse.anims.play('mouse_run', true)
            }
            this.mouse.setFlipX(true)
            this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(-1, 0)
            this.mouse.setVelocityX(-this.speed)
            this.pointer.worldX -= this.speed
        }

        //pause movement when hovering over the mouse character
        if (this.pointer.worldX > this.mouse.x && this.pointer.worldX < this.mouse.x + this.tile*3) {
            this.mouse.anims.stop()
            this.mouse.setFrame(4) 
            this.mouse.setVelocityX(0)
        }

        //pause movement if the cursor leaves the game area
        if (!this.input.isOver) {
            this.mouse.anims.stop()
            this.mouse.setFrame(4) 
            this.mouse.setVelocityX(0)
            this.pointer.worldY = this.mouse.y
        }

        //jump to giant scene (kept separate to more easily manage locking the camera)
        if (this.mouse.x >= this.tile*140) {
            this.scene.start('giantScene', {wind: this.wind})
        }
    }
}