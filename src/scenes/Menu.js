class Menu extends Phaser.Scene{
    constructor() {
        super('menuScene')
    }

    init () {
        this.tile = 32
    }

    create() {
        this.add.image(0, 0, 'title').setOrigin(0, 0)
        this.icon = this.add.image(this.tile*22 - 4, this.tile*9 - 10, 'icon')

        //pointer setup
        this.pointer = this.input.activePointer

        // start game by clicking on the icon
        this.input.on('pointerdown', () => {
            if (this.pointer.x > this.tile*21 + 2 && this.pointer.x < gameWidth - this.tile*5 + 2 && this.pointer.y > this.tile*8 - 4 && this.pointer.y < gameHeight - this.tile*6 - 4) {
                this.scene.start('playScene', {mouseX: 384, mouseY: 1952})
            }
        })
    }
        
    update() {
        //icon reacts when hovered over
        if (this.pointer.x > this.tile*21 + 2 && this.pointer.x < gameWidth - this.tile*5 + 2 && this.pointer.y > this.tile*8 - 4 && this.pointer.y < gameHeight - this.tile*6 - 4) {
            this.tweens.add({
                targets: this.icon,
                scale: 1.1,
                duration: 100
            })
        } else {
            this.tweens.add({
                targets: this.icon,
                scale: 1,
                duration: 100
            })
        }
    }
}