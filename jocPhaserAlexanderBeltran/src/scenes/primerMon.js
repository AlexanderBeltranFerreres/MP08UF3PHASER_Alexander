import Phaser from 'phaser';

export default class primerMon extends Phaser.Scene {
    constructor() {
        super('primerMon');
        this.player = null;
        this.cursors = null;
        this.lives = 3;
        this.score = 0;
        this.scoreText = null;
        this.livesText = null;
        this.coinsGroup = null;
        this.portal = null;
        this.attackKey = null;
        this.jumpKey = null;
        this.isAttacking = false;
    }

    preload() {
        this.load.image('background', 'assets/background/background.png');
        this.load.image('platform', 'assets/plataformes/plataforma.png');
        this.load.image('coin', 'assets/objects/NBG_Cigarro.png');
        this.load.image('portal', 'assets/objects/NBK_Portal.png');

        this.load.spritesheet('playerIdle', 'assets/personatge/noBKG_KnightIdle_strip.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('playerRun', 'assets/personatge/noBKG_KnightRun_strip.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('playerJump', 'assets/personatge/noBKG_KnightJumpAndFall_strip.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('playerAttack', 'assets/personatge/noBKG_KnightAttack_strip.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('playerDeath', 'assets/personatge/noBKG_KnightDeath_strip.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        // Fons
        this.add.image(400, 300, 'background').setScrollFactor(0);

        // Plataformes
        this.platforms = this.physics.add.staticGroup();

        // Creem plataformes amb escala reduïda (per exemple 0.5)
        let plat1 = this.platforms.create(400, 580, 'platform').setScale(0.3);
        let plat2 = this.platforms.create(600, 450, 'platform').setScale(0.3);
        let plat3 = this.platforms.create(50, 350, 'platform').setScale(0.8);
        let plat4 = this.platforms.create(750, 220, 'platform').setScale(0.5);

        // IMPORTANT: després d'escalar en staticGroup, refresquem hitboxes
        this.platforms.children.iterate((plat) => {
            plat.refreshBody();
        });

        // Player
        this.player = this.physics.add.sprite(100, 450, 'playerIdle', 0);
        this.player.setCollideWorldBounds(true);

        // Animacions
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('playerAttack', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: 0
        });
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('playerDeath', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: 0
        });

        this.player.play('idle');

        // Col·lisions player - plataformes
        this.physics.add.collider(this.player, this.platforms);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Monedes
        this.coinsGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.coinsGroup.children.iterate((coin) => {
            coin.body.setSize(coin.width * 0.14, coin.height * 0.14);
            coin.body.setOffset(0, 0);
        });
        // Crear monedes amb escala petita
        let coin1 = this.coinsGroup.create(600, 400, 'coin').setScale(0.14);
        let coin2 = this.coinsGroup.create(50, 300, 'coin').setScale(0.14);
        let coin3 = this.coinsGroup.create(700, 180, 'coin').setScale(0.14);

        // No cal refreshBody perquè no tenen física (immovable + no gravetat)

        this.physics.add.overlap(this.player, this.coinsGroup, this.collectCoin, null, this);

        // Portal
        this.portal = this.physics.add.sprite(780, 150, 'portal').setScale(0.5);
        this.portal.body.setAllowGravity(false);
        this.portal.setImmovable(true);

        this.physics.add.collider(this.portal, this.platforms);
        this.physics.add.overlap(this.player, this.portal, this.enterPortal, null, this);

        // Càmera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 1600, 600);

        this.physics.world.setBounds(0, 0, 1600, 600);

        // HUD
        this.scoreText = this.add.text(16, 16, 'Monedes: 0', { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);
        this.livesText = this.add.text(16, 48, 'Vides: 3', { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);

        // Quan acaba animació d’atac, tornem a idle o run
        this.player.on('animationcomplete-attack', () => {
            this.isAttacking = false;
        });
    }

    update() {
        if (!this.player.active) return;

        // Si està atacant, no moure ni canviar animació
        if (this.isAttacking) {
            this.player.setVelocityX(0);
            return;
        }

        // Saltar amb UP o SPACE
        const isJumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.jumpKey);

        // Saltar només si està tocant terra (utilitzem .onFloor())
        if (isJumpPressed && this.player.body.onFloor()) {
            this.player.setVelocityY(-400);
            this.player.anims.play('jump', true);
        }

        // Moviment esquerra/dreta
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            if (this.player.body.onFloor() && this.player.anims.currentAnim.key !== 'run')
                this.player.anims.play('run');
            this.player.setFlipX(true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            if (this.player.body.onFloor() && this.player.anims.currentAnim.key !== 'run')
                this.player.anims.play('run');
            this.player.setFlipX(false);
        }
        else {
            this.player.setVelocityX(0);
            if (this.player.body.onFloor() && this.player.anims.currentAnim.key !== 'idle')
                this.player.anims.play('idle');
        }

        // Si està a l'aire i no saltant, animació jump
        if (!this.player.body.onFloor() && this.player.anims.currentAnim.key !== 'jump') {
            this.player.anims.play('jump');
        }

        // Atacar
        if (Phaser.Input.Keyboard.JustDown(this.attackKey) && !this.isAttacking) {
            this.isAttacking = true;
            this.player.setVelocityX(0);
            this.player.anims.play('attack');
        }
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.score += 1;
        this.scoreText.setText('Monedes: ' + this.score);
    }

    enterPortal(player, portal) {
        this.scene.start('segonMon');
    }
}
