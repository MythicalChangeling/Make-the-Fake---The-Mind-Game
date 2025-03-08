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

        //add giant
        this.giant = this.add.image(this.tile*126, this.tile*8, 'giant')

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

        this.physics.add.collider(this.mouse, groundLayer)

        //pointer setup
        this.pointer = this.input.activePointer
        this.pointer.worldX = this.mouse.x
        this.pointer.worldY = this.mouse.y

        this.giantRules = this.sound.add('giantRules')

        //giant appears
        if (!giantShown) {
            this.mouseLock = true
            this.giant.setY(this.tile*5)
            this.sound.play('giantRules')
            this.time.addEvent({
                delay: 11000,
                callback: () => {this.mouseLock = false}
            })
            let giantSpawn = this.tweens.add({
                targets: this.giant,
                alpha: {from: 0, to: 1},
                scale: {from: .5, to: 1},
                y: this.tile*8,
                duration: 500,
                ease: 'Quint.easeIn'
            })
            giantShown = true
        }

        //goblet click
        this.input.on('pointerdown', () => {
            if (this.pointer.x < gameWidth - this.tile*6 && this.pointer.x > this.tile*19 && this.pointer.y < gameHeight - this.tile*2 && this.pointer.y > this.tile*6) {
                this.mouseLock = true
                console.log(this.mouseLock)
                this.physics.world.gravity.y = 0
                let mouseChoose = this.tweens.chain({
                    targets: this.mouse,
                    tweens: [
                        {
                            x: this.tile*128,
                            duration: 300,
                        },
                        {
                            y: this.tile*6,
                            duration: 750,
                        },
                        {
                            y: this.tile*6,
                            duration: 750,
                        },
                        {
                            x: this.tile*129, 
                            y: this.tile*4,
                            duration: 200,
                        },
                        {
                            x: this.tile*129.75, 
                            y: this.tile*3.25,
                            duration: 150,
                        },
                        {
                            x: this.tile*130.25, 
                            y: this.tile*3,
                            duration: 100,
                        },
                        {
                            x: this.tile*130.75, 
                            y: this.tile*3.25,
                            duration: 100,
                        },
                        {
                            x: this.tile*131, 
                            y: this.tile*7,
                            duration: 150,
                            alpha: 0
                        }
                    ]
                })
            }
            if (this.pointer.x > this.tile*6 && this.pointer.x < gameWidth - this.tile*19 && this.pointer.y < gameHeight - this.tile*2 && this.pointer.y > this.tile*6) {
                this.mouseLock = true
                console.log(this.mouseLock)
                this.physics.world.gravity.y = 0
                let mouseChoose = this.tweens.chain({
                    targets: this.mouse,
                    tweens: [
                        {
                            x: this.tile*121,
                            duration: 300,
                        },
                        {
                            y: this.tile*6,
                            duration: 750,
                        },
                        {
                            y: this.tile*6,
                            duration: 750,
                        },
                        {
                            x: this.tile*120, 
                            y: this.tile*4,
                            duration: 200,
                        },
                        {
                            x: this.tile*119.25, 
                            y: this.tile*3.25,
                            duration: 150,
                        },
                        {
                            x: this.tile*118.75, 
                            y: this.tile*3,
                            duration: 100,
                        },
                        {
                            x: this.tile*118.25, 
                            y: this.tile*3.25,
                            duration: 100,
                        },
                        {
                            x: this.tile*118, 
                            y: this.tile*7,
                            duration: 150,
                            alpha: 0
                        }
                    ]
                })
            }
        })
    }

    update() {
        //right/left movement
        if (this.pointer.worldX > this.mouse.x + this.tile*3 && !this.mouseLock) {
            this.mouse.setVelocityX(this.speed)
        }

        if (this.pointer.worldX < this.mouse.x && !this.mouseLock) {
            this.mouse.setVelocityX(-this.speed)
            this.pointer.worldX -= this.speed*2
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