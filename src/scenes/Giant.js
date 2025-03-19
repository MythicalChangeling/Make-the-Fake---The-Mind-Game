class Giant extends Phaser.Scene{
    constructor() {
        super('giantScene')
    }

    init(sound) {
        this.wind = sound.wind

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
        this.giant = this.add.sprite(this.tile*140, this.tile*8, 'giant', 1)
        this.add.image(this.tile*140, this.tile*8, 'giant_fog')
        this.giantTalk = this.giant.anims.create({
            key: 'giant_talk',
            frameRate: 3,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('giant', {start: 0, end: 1})
        })

        const gobletLayer = this.map.createLayer('Goblets', tileset, 0, 0)
        const groundLayer = this.map.createLayer('Ground', tileset, 0, 0)
        const rootsLayer = this.map.createLayer('Roots', tileset, 0, 0)

        this.blackScreen = this.add.image(this.tile*140, gameHeight/2, 'black_screen').setAlpha(0)
        this.transition = this.add.image(this.tile*140, gameHeight/2, 'title_fade').setAlpha(0)

        groundLayer.setCollisionByProperty({collides: true})

        // add mouse
        this.mouse = this.physics.add.sprite(this.tile*140, this.tile*13, 'mouse', 4)
        this.mouse.body.setCollideWorldBounds(true)
        this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(this.tile*3, 0)
        this.mouse.anims.create({
            key: 'mouse_run',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('mouse', {start: 0, end: 3})
        })
        this.mouse.anims.create({
            key: 'mouse_climb',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('mouse', {frames: [0, 1, 2, 2, 3]})
        })

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.centerOn(this.mouse.x, 0)

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

        this.physics.add.collider(this.mouse, groundLayer)

        //pointer setup
        this.pointer = this.input.activePointer
        this.pointer.worldX = this.mouse.x
        this.pointer.worldY = this.mouse.y

        //sounds
        this.giantRules = this.sound.add('giantRules')
        this.giantScream = this.sound.add('giant_death')
        this.mouseDeath = this.sound.add('mouse_death')

        //giant appears
        if (!giantShown) {
            this.mouseLock = true
            this.giant.setY(this.tile*5)
            this.sound.play('giantRules')
            this.time.addEvent({
                delay: 11000,
                callback: () => {
                    this.mouseLock = false
                }
            })
            this.time.addEvent({
                delay: 5050,
                callback: () => {
                    this.giant.anims.play('giant_talk', true)
                    this.time.addEvent({
                        delay: 5950,
                        callback: () => {this.giant.anims.stop()}
                    })}
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

        //player clicks on a goblet or the giant
        this.input.on('pointerdown', () => {
            if (this.pointer.x < gameWidth - this.tile*6 && this.pointer.x > this.tile*19 && this.pointer.y < gameHeight - this.tile*2 && this.pointer.y > this.tile*6 && !this.mouseLock) {
                this.mouseLock = true
                this.physics.world.gravity.y = 0
                this.mouse.anims.play('mouse_run')
                this.mouse.setVelocityX(0)
                let mouseChoose = this.tweens.chain({
                    targets: this.mouse,
                    tweens: [
                        {
                            x: this.tile*144,
                            duration: 300,
                            onComplete: () => {
                                this.mouse.angle = -90
                                this.mouse.body.setSize(this.tile*2, this.tile*3).setOffset(this.tile*2, -this.tile*2)
                                this.mouse.anims.play('mouse_climb')
                            }
                        },
                        {
                            y: this.tile*8,
                            duration: 750,
                            onComplete: () => {
                                this.mouseDeath.play()
                                this.wind.stop()
                                this.mouse.anims.stop()
                                this.time.addEvent({
                                    delay: 6800,
                                    callback: () => {this.giant.anims.play('giant_talk')}
                                })
                                this.mouseDeath.on('complete', () => {
                                    giantShown = false
                                    this.tweens.add({
                                        targets: this.transition,
                                        alpha: 1,
                                        duration: 200,
                                        onComplete: () => {this.scene.start('menuScene')}
                                    })
                                })
                            }
                        },
                        {
                            y: this.tile*8,
                            duration: 750,
                        },
                        {
                            x: this.tile*143, 
                            y: this.tile*4,
                            duration: 150,
                            onComplete: () => {
                                this.mouse.angle = 0
                                this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(this.tile*3, 0)
                                this.mouse.setFrame(0)
                            }
                        },
                        {
                            x: this.tile*143.75, 
                            y: this.tile*3.25,
                            duration: 100,
                        },
                        {
                            x: this.tile*144.25, 
                            y: this.tile*3,
                            duration: 50,
                        },
                        {
                            x: this.tile*144.75, 
                            y: this.tile*3.25,
                            duration: 50,
                        },
                        {
                            x: this.tile*145, 
                            y: this.tile*7,
                            duration: 150,
                            alpha: 0
                        }
                    ]
                })
            } else if (this.pointer.x > this.tile*6 && this.pointer.x < gameWidth - this.tile*19 && this.pointer.y < gameHeight - this.tile*2 && this.pointer.y > this.tile*6 && !this.mouseLock) {
                this.mouseLock = true
                this.physics.world.gravity.y = 0
                this.mouse.anims.play('mouse_run')
                this.mouse.setFlipX(true)
                this.mouse.setVelocityX(0)
                this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(-1, 0)
                let mouseChoose = this.tweens.chain({
                    targets: this.mouse,
                    tweens: [
                        {
                            x: this.tile*136,
                            duration: 300,
                            onComplete: () => {
                                this.mouse.angle = 90
                                this.mouse.body.setSize(this.tile*2, this.tile*3).setOffset(this.tile*2, -this.tile*2)
                                this.mouse.anims.play('mouse_climb')
                            }
                        },
                        {
                            y: this.tile*8,
                            duration: 750,
                            onComplete: () => {
                                this.mouseDeath.play()
                                this.wind.stop()
                                this.mouse.anims.stop()
                                this.time.addEvent({
                                    delay: 6800,
                                    callback: () => {this.giant.anims.play('giant_talk')}
                                })
                                this.mouseDeath.on('complete', () => {
                                    giantShown = false
                                    this.tweens.add({
                                        targets: this.transition,
                                        alpha: 1,
                                        duration: 200,
                                        onComplete: () => {this.scene.start('menuScene')}
                                    })
                                })
                            }
                        },
                        {
                            y: this.tile*8,
                            duration: 750,
                        },
                        {
                            x: this.tile*137, 
                            y: this.tile*4,
                            duration: 150,
                            onComplete: () => {
                                this.mouse.angle = 0
                                this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(-1, 0)
                                this.mouse.setFrame(0)
                            }
                        },
                        {
                            x: this.tile*136.25, 
                            y: this.tile*3.25,
                            duration: 100,
                        },
                        {
                            x: this.tile*135.75, 
                            y: this.tile*3,
                            duration: 50,
                        },
                        {
                            x: this.tile*135.25, 
                            y: this.tile*3.25,
                            duration: 50,
                        },
                        {
                            x: this.tile*135, 
                            y: this.tile*7,
                            duration: 150,
                            alpha: 0
                        }
                    ]
                })
            } 
            else if (this.pointer.x > this.tile*10 && this.pointer.x < gameWidth - this.tile*10 && this.pointer.y < gameHeight - this.tile*11 && this.pointer.y > this.tile*3 && !this.mouseLock) {
                this.mouseLock = true
                this.physics.world.gravity.y = 0
                this.mouse.anims.play('mouse_run')
                this.mouse.setFlipX(true)
                this.mouse.setVelocityX(0)
                this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(-1, 0)
                let mouseChoose = this.tweens.chain({
                    targets: this.mouse,
                    tweens: [
                        {
                            x: this.tile*136,
                            duration: 300,
                            onComplete: () => {
                                this.mouse.angle = 90
                                this.mouse.body.setSize(this.tile*2, this.tile*3).setOffset(this.tile*2, -this.tile*2)
                                this.mouse.anims.play('mouse_climb')
                            }
                        },
                        {
                            y: this.tile*8,
                            duration: 750,
                            onComplete: () => {
                                this.mouse.anims.stop()
                            }
                        },
                        {
                            y: this.tile*8,
                            duration: 750,
                            onComplete: () => {
                                this.mouse.angle = 0
                                this.mouse.setFlipX(false)
                                this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(-1, 0)
                                this.mouse.setFrame(0)
                            }
                        },
                        {
                            x: this.tile*135, 
                            y: this.tile*2,
                            duration: 200,
                        },
                        {
                            x: this.tile*136, 
                            y: this.tile*3,
                            duration: 75,
                            onComplete: () => {
                                this.giantScream.play()
                                this.wind.stop()
                                this.giantScream.on('complete', () => {
                                    giantShown = false
                                    this.tweens.add({
                                        targets: this.transition,
                                        alpha: 1,
                                        duration: 200,
                                        onComplete: () => {this.scene.start('menuScene')}
                                    })
                                })
                                giantDeath.play()
                            }
                        },
                    ]
                })
                let giantDeath = this.tweens.add({
                    targets: [this.mouse, this.giant],
                    paused: true,
                    y: this.tile*25,
                    duration: 300,
                    onComplete: () => {
                        fadeBlack.play()
                    }
                })
                let fadeBlack = this.tweens.chain({
                    targets: this.blackScreen,
                    paused: true,
                    tweens: [
                        {
                            alpha: 0,
                            duration: 2500
                        },
                        {
                            alpha: 1,
                            duration: 1000
                        },
                    ]
                })
            }
        })
    }

    update() {
        //right/left movement
        if (this.pointer.worldX > this.mouse.x + this.tile*3 && !this.mouseLock) {
            this.mouse.anims.play('mouse_run', true)
            this.mouse.setFlipX(false)
            this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(this.tile*3, 0)
            this.mouse.setVelocityX(this.speed)
        }

        if (this.pointer.worldX < this.mouse.x && !this.mouseLock) {
            this.mouse.anims.play('mouse_run', true)
            this.mouse.setFlipX(true)
            this.mouse.body.setSize(this.tile*3, this.tile*2).setOffset(-1, 0)
            this.mouse.setVelocityX(-this.speed)
            this.pointer.worldX -= this.speed*2
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

        //return to play scene
        if (this.mouse.x < this.tile*130) {
            this.scene.start('playScene', {mouseX: this.mouse.x, mouseY: this.mouse.y})
        }
    }
}