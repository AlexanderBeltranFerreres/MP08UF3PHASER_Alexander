import Phaser from 'phaser';

export default class segonMon extends Phaser.Scene {
    constructor() {
        super('segonMon');
        this.player = null;
        this.enemics = null;
        this.plataformes = null;
        this.cursors = null;
        this.vides = 3;
        this.punts = 0;
        this.puntsText = null;
        this.videsText = null;
        this.cigarrosGroup = null;
        this.portal = null;
        this.attackKey = null;
        this.jumpKey = null;
        this.isAttacking = false;
        this.invulnerable = false;
        this.playerIsDying = false;
    }

    preload() {

       // this.load.audio('musicaFons', 'assets/audio/musicaFons.mp3');

        this.load.image('background', 'assets/background/background.png');
        this.load.image('platforma', 'assets/plataformes/plataforma.png');
        this.load.image('cigarro', 'assets/objects/NBG_Cigarro.png');
        this.load.image('portal', 'assets/objects/NBK_Portal.png');
        this.load.image('punxaMetalGran', 'assets/objects/long_metal_spike.png');
        this.load.image('punxaFustaPetita', 'assets/objects/small_wood_spike.png');
        this.load.image('agenciaTributaria', 'assets/objects/agencia_tributaria.png');


        // Player
        this.load.spritesheet('estatic', 'assets/personatge/noBKG_KnightIdle_strip.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('playerRun', 'assets/personatge/noBKG_KnightRun_strip.png', { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet('playerJump', 'assets/personatge/noBKG_KnightJumpAndFall_strip.png', { frameWidth: 154, frameHeight: 64 });
        this.load.spritesheet('playerAttack', 'assets/personatge/noBKG_KnightAttack_strip.png', { frameWidth: 144, frameHeight: 64 });
        this.load.spritesheet('playerDeath', 'assets/personatge/noBKG_KnightDeath_strip.png', { frameWidth: 96, frameHeight: 64 });

        // Enemic
        this.load.spritesheet('enemicEstatic', 'assets/enemic/NightBorne_idle.png', { frameWidth: 166, frameHeight: 166 });
        this.load.spritesheet('enemicRun', 'assets/enemic/NightBorne_run.png', { frameWidth: 204, frameHeight: 204 });
        this.load.spritesheet('enemicHurt', 'assets/enemic/NightBorne_hurt.png', { frameWidth: 204, frameHeight: 204 });
        this.load.spritesheet('enemicAtac', 'assets/enemic/NightBorne_attack.png', { frameWidth: 144, frameHeight: 144 });
        this.load.spritesheet('enemicDeath', 'assets/enemic/NightBorne_death.png', { frameWidth: 100, frameHeight: 100 });
    }

    create() {
        this.lastEnemyHit = 0;
        this.lastPlayerHit = new WeakMap();
        this.playerIsDying = false;
        this.vides = 3;
        this.invulnerable = false;
        this.punts = 0;

        // this.musica = this.sound.add('musicaFons', {
        //     volume: 0.5,
        //     loop: true
        // });
        // this.musica.play();

        this.add.tileSprite(0, 0, 3200, 600, 'background').setOrigin(0).setScrollFactor(0);

        // Crear un fons negre semitransparent
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.7); // negre 70% opacitat
        graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Text controls
        const controlsText =
            'Controls:\n\n' +
            '➡️⬅️ Fletxes per moure\'s\n' +
            'G per atacar\n' +
            'Espai per saltar';

        // centrar text
        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, controlsText, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
            lineSpacing: 10,
        });
        text.setOrigin(0.5);

        // Agrupar fons i text en un container per poder manipular-ho més fàcil
        this.controlsContainer = this.add.container(0, 0, [graphics, text]);

        // Fer que desaparegui al prémer qualsevol tecla o després de 5s
        this.input.keyboard.once('keydown', () => {
            this.tweens.add({
                targets: this.controlsContainer,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.controlsContainer.destroy();
                }
            });
        });

        // Timeout que elimina el text automàticament després de 5 segons
        this.time.delayedCall(5000, () => {
            if (this.controlsContainer) {
                this.tweens.add({
                    targets: this.controlsContainer,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        this.controlsContainer.destroy();
                    }
                });
            }
        });

        this.plataformes = this.physics.add.staticGroup();
        [
            { x: 400, y: 580 }, { x: 800, y: 500 }, { x: 1200, y: 420 },
            { x: 1600, y: 340 }, { x: 2000, y: 280 }, { x: 2400, y: 220 }, { x: 2800, y: 160 }
        ].forEach(p => {
            this.plataformes.create(p.x, p.y, 'platforma').setScale(0.3).refreshBody();

        });

        this.punxes = this.physics.add.staticGroup();
        const punxesData = [
            { x: 400, y: 540, key: 'punxaFustaPetita' },     // damunt plataforma
            { x: 800, y: 460, key: 'agenciaTributaria' },
            { x: 1200, y: 380, key: 'punxaMetalGran' },
            { x: 1600, y: 300, key: 'agenciaTributaria' },
            { x: 2000, y: 240, key: 'punxaFustaPetita' },
            { x: 2400, y: 180, key: 'agenciaTributaria' },
            { x: 2800, y: 120, key: 'punxaMetalGran' },
        ];
        punxesData.forEach(p => {
            const punxa = this.punxes.create(p.x, p.y, p.key);
            if (p.key === 'agenciaTributaria') {
                punxa.setScale(0.17);
            } else {
                punxa.setScale(0.5);
            }
            punxa.refreshBody();
        });


        this.player = this.physics.add.sprite(100, 450, 'estatic').setCollideWorldBounds(true);

        //ANIMACIONS DEL JUGADOR
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('estatic', { start: 0, end: 14 }), // 15 frames
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 7 }), // 8 frames
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 13 }), // 14 frames
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('playerAttack', { start: 12, end: 21 }), // 22 frames
            frameRate: 22,
            repeat: 0
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('playerDeath', { start: 0, end: 14 }), // 15 frames
            frameRate: 10,
            repeat: 0
        });

        // Crear una zona d'atac invisible que es posiciona davant del jugador
        // aixi es mes facil luchar i no dona problemes les hitbox ni collicions
        this.hitboxAtacJug = this.add.zone(this.player.x, this.player.y).setSize(60, 40);
        this.physics.world.enable(this.hitboxAtacJug);
        this.hitboxAtacJug.body.setAllowGravity(false);
        this.hitboxAtacJug.body.setImmovable(true);


        // Animacions enemic
        this.anims.create({ key: 'enemicEstatic', frames: this.anims.generateFrameNumbers('enemicEstatic'), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'enemicRun', frames: this.anims.generateFrameNumbers('enemicRun'), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'enemicAtac', frames: this.anims.generateFrameNumbers('enemicAtac', { start: 0, end: 11 }), frameRate: 12 , repeat:0});
        this.anims.create({ key: 'enemicHurt', frames: this.anims.generateFrameNumbers('enemicHurt'), frameRate: 10 });
        this.anims.create({ key: 'enemicDeath', frames: this.anims.generateFrameNumbers('enemicDeath'), frameRate: 10 });

        this.physics.add.collider(this.player, this.plataformes);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Primer enemic
        this.enemics = this.physics.add.group();

        const enemic1 = this.enemics.create(800, 400, 'enemicEstatic').setScale(0.5);
        this.setupEnemy(enemic1, 700, 900); // ruta entre 700 i 900

        // segon enemic
        const enemic2 = this.enemics.create(1600, 240, 'enemicEstatic').setScale(0.5);
        this.setupEnemy(enemic2, 1500, 1700); // ruta entre 1500 i 1700


        this.physics.add.collider(this.enemics, this.plataformes);
        this.physics.add.overlap(this.player, this.enemics, this.enemicAtacaJug, null, this);
        this.physics.add.overlap(this.player, this.punxes, this.tocarPunxa, null, this);
        // Detectar col·lisió de la zona d'atac amb enemics
        this.physics.add.overlap(this.hitboxAtacJug, this.enemics, this.atacarEnemic, null, this);

        // Collecionables
        this.cigarrosGroup = this.physics.add.group();
        [600, 1200, 2000].forEach(x => {
            const cigarro = this.cigarrosGroup.create(x, 300, 'cigarro').setScale(0.10);
            cigarro.body.allowGravity = false;
            cigarro.setImmovable(true);
        });
        this.physics.add.overlap(this.player, this.cigarrosGroup, this.agafarCigarro, null, this);

        // Portal
        this.portal = this.physics.add.sprite(3000, 100, 'portal').setScale(0.5).setImmovable(true);
        this.portal.body.setAllowGravity(false);
        this.physics.add.collider(this.portal, this.plataformes);
        this.physics.add.overlap(this.player, this.portal, this.enterPortal, null, this);

        // Camara
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 3200, 600);
        this.physics.world.setBounds(0, 0, 3200, 600);

        // textos
        const textStyle = {
            fontFamily: 'Segoe UI',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                stroke: true,
                fill: true
            }
        };

        this.puntsText = this.add.text(16, 16, 'NICOTINA: 0', textStyle).setScrollFactor(0);
        this.videsText = this.add.text(16, 48, 'VIDES: 3 💚', textStyle).setScrollFactor(0);

        this.player.on('animationcomplete-attack', () => this.isAttacking = false);
        this.player.on('animationcomplete-death', () => this.isAttacking = false);
    }
    setupEnemy(enemic, minX, maxX) {
        enemic.play('enemicEstatic');
        enemic.setCollideWorldBounds(true);
        enemic.health = 2;
        enemic.isAttacking = false;
        enemic.isBeingHit = false;
        enemic.alive = true;

        enemic.setSize(100, 100, true);
        enemic.setOffset(50, 80);
        enemic.minX = minX;
        enemic.maxX = maxX;
        enemic.direction = 'left';

        // Fix per evitar caure de la plataforma
        enemic.setDragX(1000);
    }

    update() {
        if (!this.player) return;

        // Comprova mort jugador
        if (this.vides <= 0 && !this.playerIsDying) {
            this.playerIsDying = true;
            this.player.setVelocity(0, 0);
            this.player.play('death');
            this.time.delayedCall(1500, () => {
                this.scene.start('gameOver', { punts: this.punts });
            });
            return;
        }

        // SI NO ESTA MORT ES POT MOURE
        if (!this.playerIsDying) {
            // Moure la hitbox de atacar  sempre dabant del jugador
            if (this.player.flipX) {
                this.hitboxAtacJug.setPosition(this.player.x - 40, this.player.y);
            } else {
                this.hitboxAtacJug.setPosition(this.player.x + 40, this.player.y);
            }

            const onGround = this.player.body.onFloor();
            const anim = this.player.anims.currentAnim?.key;

            // Atac jugador
            if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
                this.isAttacking = true;
                this.player.setVelocityX(0);
                this.player.play('attack');
                this.time.delayedCall(400, () => {
                    this.isAttacking = false;
                });
            }

            // Moviment jugador
            if (!this.isAttacking) {
                if ((Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.jumpKey)) && onGround) {
                    this.player.setVelocityY(-400);
                    if (anim !== 'jump') this.player.play('jump', true);
                } else if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-160);
                    this.player.setFlipX(true);
                    if (onGround && anim !== 'run') this.player.play('run', true);
                } else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(160);
                    this.player.setFlipX(false);
                    if (onGround && anim !== 'run') this.player.play('run', true);
                } else {
                    this.player.setVelocityX(0);
                    if (onGround && anim !== 'idle') this.player.play('idle', true);
                }

                // Saltar animació si a l’aire
                if (!onGround && anim !== 'jump') {
                    this.player.play('jump', true);
                }
            }
        }

        // Lògica enemics
        this.enemics.getChildren().forEach(enemic => {
            if (!enemic.alive) return;

            const dist = Phaser.Math.Distance.Between(enemic.x, enemic.y, this.player.x, this.player.y);

            // No atacar si el jugador està morint
            if (this.playerIsDying) {
                enemic.setVelocityX(0);
                enemic.isAttacking = false;
                if (enemic.anims.currentAnim?.key !== 'enemicEstatic') {
                    enemic.play('enemicEstatic');  // posar animació idle o quieta si tens
                }
                return;
            }

            // Si està atacant o sent colpejat, no canviar animació
            if (enemic.isAttacking || enemic.isBeingHit) {
                enemic.setVelocityX(0); // opcional: aturar moviment
                return; // sortir, no fer res més aquest update
            }

            if (dist < 60) {
                enemic.isAttacking = true;
                enemic.setVelocityX(0);
                enemic.play('enemicAtac', true);
                enemic.once('animationcomplete-enemicAtac', () => {
                    if (enemic.alive && !enemic.isBeingHit) {
                        const newDist = Phaser.Math.Distance.Between(enemic.x, enemic.y, this.player.x, this.player.y);
                        if (newDist < 60) this.enemicAtacaJug(this.player, enemic);
                    }
                    enemic.isAttacking = false;
                });
            } else {
                // moviment patrulla
                if (enemic.x <= enemic.minX) enemic.direction = 'right';
                else if (enemic.x >= enemic.maxX) enemic.direction = 'left';

                enemic.setVelocityX(enemic.direction === 'left' ? -50 : 50);
                enemic.setFlipX(enemic.direction === 'left');

                if (enemic.anims.currentAnim?.key !== 'enemicRun') enemic.play('enemicRun');
            }
        });
    }

    agafarCigarro(player, cigarro) {
        cigarro.destroy();
        this.punts++;
        this.puntsText.setText('NICOTINA: ' + this.punts);
    }

    enterPortal() {
        this.scene.start('victoria');
    }

    enemicAtacaJug(player, enemic) {
        const now = this.time.now;
        if (!enemic.alive || this.invulnerable || now - this.lastenemyHit < 1000) return;

        this.lastenemyHit = now;
        this.vides--;
        this.videsText.setText('Vides: ' + this.vides);

        this.invulnerable = true;
        this.player.setTint(0xff0000);
        this.time.delayedCall(1000, () => {
            this.invulnerable = false;
            this.player.clearTint();
        });

        // Si les vides s'han acabat i no estem morint
        if (this.vides <= 0 && this.player.anims.currentAnim?.key !== 'death') {
            this.playerIsDying = true;
            this.player.setVelocity(0);
            this.player.body.enable = false;
            this.player.play('death');
            //this.scene.start('gameOver', { punts: this.punts });
            this.player.active = false;

            // Parem tots els enemics
            this.enemics.getChildren().forEach(e => {
                //e.setVelocityX(0);
                e.isAttacking = false;
            });

            this.time.delayedCall(1500, () => {
                this.scene.start('gameOver', { punts: this.punts });
            });
        }
    }

    atacarEnemic(hitboxAtac, enemic) {
        if (!this.isAttacking || enemic.isBeingHit || !enemic.alive) return;

        // Evitar hits molt ràpids
        const now = this.time.now;
        const lastHit = this.lastPlayerHit.get(enemic) || 0;
        if (now - lastHit < 500) return;
        this.lastPlayerHit.set(enemic, now);

        // Restar vida i fer animacio del hit
        enemic.health--;
        enemic.isBeingHit = true;
        enemic.play('enemicHurt');

        // Quan acabi animació de "hurt", permetre tornar a rebre dany
        enemic.once('animationcomplete-enemicHurt', () => {
            enemic.isBeingHit = false;
            if (enemic.health <= 0) {
                enemic.alive = false;
                enemic.play('enemicDeath');
                enemic.body.enable = false;
                enemic.once('animationcomplete-enemicDeath', () => enemic.destroy());
            } else {
                enemic.play('enemicEstatic');
            }
        });
    }

    tocarPunxa(player, punxa) {
        if (!this.invulnerable) { // per a no perdre totes les vides
            this.vides--;
            this.videsText.setText('Vides: ' + this.vides);

            this.invulnerable = true;
            this.player.setTint(0xff0000);
            this.time.delayedCall(1000, () => {
                this.invulnerable = false;
                this.player.clearTint();
            });

            if (this.vides <= 0) {
                this.player.play('death');
                this.time.delayedCall(1500, () => {
                    this.scene.start('gameOver', { punts: this.punts });
                });
            }
        }
    }

}
