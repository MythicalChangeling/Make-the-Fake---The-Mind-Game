class Menu extends Phaser.Scene{
    constructor() {
        super('menuScene')
    }

    create() {
        this.add.text(0, 0, 'click')

        this.input.on('pointerdown', () => {this.scene.start('playScene', {mouseX: 3200, mouseY: 1952})})
    }
}