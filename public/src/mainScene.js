class mainScene extends Phaser.Scene {

	constructor() {
		super("mainScene");
	}

	preload() {
    //Sprites
		this.load.spritesheet("types", "./assets/images/types.png", {
		  frameWidth: 32,
		  frameHeight: 16,
		});
    this.load.spritesheet("player", "./assets/images/trainer.png", {
		  frameWidth: 64,
		  frameHeight: 64,
		});

    //Audios
		this.load.audio("theme", ["./assets/audio/Cianwood-City.mp3"]);
		this.load.audio("theme", ["./assets/audio/Cianwood-City.mp3"]);
    this.load.audio("click", ["./assets/audio/click.mp3"]);
    this.load.audio("collision", ["./assets/audio/collision.m4a"]);
    this.load.audio("snorlax", ["./assets/audio/snorlax.mp3"]);

    // Archivos de datos
		this.load.json('movesData', 'data/moves.json');
		this.Pokedex_json=this.load.json('pokedexData', 'data/pokedex.json');

    //Imagenes

    // https://pkmn.net/?action=content&page=viewpage&id=8628&parentsection=87

		for (let i = 1; i < 152; i++) {
			this.load.image('pokemon' + i, 'assets/images/pokemons/front/' + i.toString() + '.png');
		}
		// https://pkmn.net/?action=content&page=viewpage&id=8594&parentsection=223

    for (let i = 1; i < 152; i++) {
			this.load.image('pokemon-back' + i, 'assets/images/pokemons/back/' + i.toString() + '.png');
		}
    this.map=this.load.image("city", "./assets/images/mapa.webp");
    this.load.image("torre", "./assets/images/TorreCombates.webp");
		this.load.image("fence", "./assets/images/fence.png");
		this.load.image("snorlax", "./assets/images/snorlax.png");
    this.load.image("pokemon_info", "./assets/images/pokemon_info.png");
		this.load.image('background', 'assets/images/pokemon-menu-background.png');
		this.load.image('party-0', 'assets/images/party-0.png');
		this.load.image('party-0-highlighted', 'assets/images/party-0-highlighted.png');
		this.load.image('party-0-blank', 'assets/images/party-0-blank.png');
		this.load.image('party', 'assets/images/party.png');
		this.load.image('party-highlighted', 'assets/images/party-highlighted.png');
		this.load.image('party-blank', 'assets/images/party-blank.png');
		this.load.image('hp-bar', 'assets/images/hp_bar.png');
		this.load.image('battle-background', 'assets/images/battle_background.png');
		this.load.image('battle-bar', 'assets/images/battle-bar.png');
		this.load.image('opponent-battle-bar', 'assets/images/opponent-battle-bar.png');
		this.load.image('bag-background', 'assets/images/bag-background.png');
    this.load.image('pokeball', './assets/images/pokemon-menu-pokeball2.png');
		this.load.image('selected-cancel', './assets/images/selected-cancel.png');
    this.load.image("enemy", "./assets/images/enemy.png");
    this.load.image("trainer_profile", "./assets/images/trainer_profile.png");
    this.load.image("card_background", "./assets/images/card_background.png");
    this.load.image("card", "./assets/images/trainer_card.png");


		// Menu Cargando
		var loading_background = this.add.graphics();
		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(290, 290, 320, 50);

		var width = this.cameras.main.width;
		var height = this.cameras.main.height;
		var loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Cargando...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		var percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});
		percentText.setOrigin(0.5, 0.5);

		var assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: '',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});

		assetText.setOrigin(0.5, 0.5);

		loading_background.fillStyle(0x000000, 1);
		loading_background.fillRect(0, 0, 600, 600);

		this.load.on('progress', function (value) {
			percentText.setText(parseInt(value * 100) + '%');
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(300, 300, 300 * value, 30);
		});

		this.load.on('fileprogress', function (file) {
			assetText.setText('Loading asset: ' + file.key);
		});

		this.load.on('complete', function () {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
			loading_background.destroy();
		});
	}

	create(data) {
    this.combateGanado =false;
		//Añadimos el mapa
		this.mapaCiudad = this.add.image(720, 750, "city").setScale(1.5);
    this.click = this.sound.add("click");
    this.click.setVolume(0.04);
    this.collision = this.sound.add("collision");
    this.collision.setVolume(0.04);
    this.isTyping = false;
    this.snorlaxSound= this.sound.add("snorlax");
    this.snorlaxSound.setVolume(0.04);
    this.snorlaxxEvent=false;
    		//Añadimos musica
		this.music = this.sound.add("theme");
		this.sound.pauseOnBlur = true;  
		if (!this.music.isPlaying) {
		  this.music.play();
		  this.music.setVolume(0.04);
		}
		// Variables
		this.moving = false;
		this.menuOn = false;
		this.selectedMenu = null;
		this.isMainScene = true;
    this.numeroRonda=1;
    this.puntos=0;


		this.cursors = this.input.keyboard.createCursorKeys();
		this.enterKey = this.input.keyboard.addKey('ENTER');
		this.yesKey = this.input.keyboard.addKey('A');
		this.noKey = this.input.keyboard.addKey('B');

		// Max number of pokemon is 6. At least 1 pokemon.
    this.pokedexData = this.cache.json.get('pokedexData');
		this.pokemon_rarity_tiers = [9, 10, 10, 9, 10, 10, 9, 10, 10, 1, 2, 4, 1, 2, 4, 1, 1, 10, 1, 1, 1, 1, 1, 2, 5, 5, 9, 1, 1, 1, 1, 10, 1, 1, 10, 3, 7, 3, 10, 1, 4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 4, 10, 1, 4, 5, 5, 4, 10, 1, 1, 4, 1, 1, 3, 1, 1, 1, 1, 10, 4, 6, 1, 1, 1, 2, 3, 1, 1, 1, 2, 1, 3, 7, 7, 3, 4, 10, 3, 1, 2, 1, 2, 1, 2, 4, 10, 5, 5, 8, 8, 5, 2, 5, 4, 5, 8, 2, 8, 1, 3, 1, 2, 6, 10, 8, 8, 6, 9, 8, 8, 5, 1, 1, 9, 7, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 10, 10, 10, 8, 8, 10, 10, 10];
		var temp = 0;
		this.pokemon_rarity_cumulative = this.pokemon_rarity_tiers.map(function (x) {
			temp += x;
			return temp;
		});


    // Creamos el equipo dentro de la partida
    this.pokemons = [];
    for (const pokedex of this.pokedexData) {
      for (const nombrePokemon of equipoPokemon) {
         
        let nombreFraccionado = nombrePokemon.split("");
        for (let index = 0; index < nombreFraccionado.length; index++) {
          if (index==0) {
            nombreFraccionado[0]=nombreFraccionado[0].toUpperCase();
          }
          else{
            nombreFraccionado[index]=nombreFraccionado[index].toLowerCase();
          }
        }
        let nombreFiltrado = nombreFraccionado.join("");
        if (pokedex.name["english"]==nombreFiltrado) {
         

          let pokemon={
            pokemon: nombreFiltrado,
            type:pokedex.type,
            moves: [],
            hp: 100,
            maxHp: 100,
            pokedex: pokedex.id
          }
          this.pokemons.push(pokemon)
        }
      }
    }
		// Convert move.json into a dictionary
		this.tempMoves = this.cache.json.get('movesData');
		this.moves = {};
		this.numMoves = this.tempMoves.length;
		for (var i = 0; i < this.numMoves; i++) {
			this.moves[this.tempMoves[i]["ename"]] = this.tempMoves[i];
		}

		// Convert move.json into dictionary by type
		this.typeMoves = {};
		for (var i = 0; i < this.numMoves; i++) {
			if (this.tempMoves[i]["type"] in this.typeMoves) {
				this.typeMoves[this.tempMoves[i]["type"]].push(this.tempMoves[i]);
			} else {
				this.typeMoves[this.tempMoves[i]["type"]] = [this.tempMoves[i]];
			}
		}


    this.pokemons.forEach(pokemon => {
      for (let index = 0; index < 4; index++) {

        
        this.tipos_pokemon = pokemon["type"];
        this.opponent_pokemon_num_types = this.tipos_pokemon.length;
          do {
            var move_type_index = this.getRandomInt(0, this.opponent_pokemon_num_types - 1);
            var type = this.tipos_pokemon[move_type_index];
            if (!(type in this.typeMoves)) {
              continue;
            }
            var num_moves = this.typeMoves[type].length;
            var move_index = this.getRandomInt(0, num_moves - 1);
            var move = this.typeMoves[type][move_index];
            pokemon.moves.push([move["ename"], move["pp"],move["type"]]);
          }
          while (!(type in this.typeMoves));
        

      }
    });

		
		this.initializePlayer();
		this.initializeMenu();
		this.toggleMenu();
		this.colisiones();
	}


	update(time, delta) {
		// Moving player

    this.movimientoPersonaje();
		
    

		// Up and down menu
		if (this.menuOn) {
			if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || this.isUpPress) {
        this.click.play();

				if (this.selectedMenu != 0) {
					this.menuPointer.y -= 30;
					this.selectedMenu -= 1;
				} else {
					this.menuPointer.y += 30 * 3;
					this.selectedMenu += 3;
				}
				this.isUpPress = false;
			}
			else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || this.isDownPress) {
        this.click.play();

				if (this.selectedMenu != 3) {
					this.menuPointer.y += 30;
					this.selectedMenu += 1;
				} else {
					this.menuPointer.y -= 30 * 3;
					this.selectedMenu -= 3;
				}
				this.isDownPress = false;
			}
			// Press yes
			else if (Phaser.Input.Keyboard.JustDown(this.yesKey) || this.isYesPress) {
        this.click.play();
				switch (this.selectedMenu) {
					case 0:
						this.toggleMenu();
						this.game.scene.sleep('mainScene');
						this.game.scene.run('escenaPokemon', this);
						break;
					case 1:
						this.toggleMenu();
						this.game.scene.sleep('mainScene');
						this.game.scene.run('escenaMochila', this);
						break;
          case 2:
            this.toggleMenu();
						this.game.scene.sleep('mainScene');
						this.game.scene.run('escenaTarjeta', this);
          break;
					case 3:
						this.toggleMenu();
						break;
				}
        
				this.isYesPress = false;
			}
			// Press no
			else if (Phaser.Input.Keyboard.JustDown(this.noKey) || this.isNoPress) {
				this.toggleMenu();
				this.isNoPress = false;
			}
		}

		// Open menu
		if (Phaser.Input.Keyboard.JustDown(this.enterKey) || this.isEnterPress) {
			this.toggleMenu();
      this.sound.pauseOnBlur = true;  
      this.click.play();
			this.isEnterPress = false;
		}
	}
	//Funcion animaciones del personaje
	initializePlayer() {
    
      this.player = this.physics.add.sprite(900, 900, "player",0).setScale(0.8);
    
		//this.player.setCollideWorldBounds(true);


      //Animaciones Para el personaje
      this.anims.create({
        key: "front",
        frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player", { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "back",
        frames: this.anims.generateFrameNumbers("player", { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1,
      });

      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.startFollow(this.player);

	}


	initializeMenu() {
    const x = this.player.x-100;
    const y = this.player.y-200;
		this.graphics = this.add.graphics();

		this.graphics.fillStyle(0x786c84, 1);
		this.graphics.fillRoundedRect(x+195, y, 185, 140, 10);
		this.graphics.fillStyle(0xfff9fd, 1);
		this.graphics.fillRoundedRect(x+200,y , 175, 140, 10);

		this.pokemonText = this.add.text(x+220, y+5, 'POKEMON', { color: '#000000', align: 'center' }).setFontSize('25px');
		this.bagText = this.add.text(x+220, y+35, 'BAG', { color: '#000000', align: 'center' }).setFontSize('25px');
    this.cardText = this.add.text(x+220, y+65, 'TARJETA', { color: '#000000', align: 'center' }).setFontSize('25px');

		this.exitText = this.add.text(x+220, y+95, 'EXIT', { color: '#000000', align: 'center' }).setFontSize('25px');

		this.menuPointer = this.add.polygon(x+210, y+15, [0, 0, 0, 20, 10, 10], 0x636363);

		this.selectedMenu = 0;
		this.menuOn = true;
	}

	toggleMenu() {
		if (this.menuPointer.visible) {
			this.graphics.clear();

			this.pokemonText.setVisible(false);
			this.bagText.setVisible(false);
			this.exitText.setVisible(false);
      this.cardText.setVisible(false)
			this.menuPointer.setVisible(false);
			this.menuOn = false;
		}
		else {
			this.initializeMenu();
		}
	}

  pararPersonaje(){
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    this.player.anims.stop();
  }

movimientoPersonaje(){
  if (this.menuOn==true || this.snorlaxxEvent==true) {
    this.pararPersonaje();
  }
  else{
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.setVelocityY(0);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.setVelocityY(0);

      this.player.anims.play("right", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      this.player.setVelocityX(0);

      this.player.anims.play("front", true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("back", true);
      this.player.setVelocityX(0);
      this.player.setVelocityY(-160);
    } else {
      this.pararPersonaje();
    }
  }
}

	colisiones(){

     //Colisiones con eventos
     this.snorlax = this.physics.add.image(440, 1250, 'snorlax').setImmovable(true).setScale(1.5);

     this.physics.add.collider(this.player, this.snorlax,()=>{
         this.snorlaxxEvent=true;
         if (!this.snorlaxSound.isPlaying && this.snorlaxxEvent==true) {
             this.snorlaxSound.play();

             this.graphics = this.add.graphics();
             this.graphics.fillStyle(0xdc5436, 1);
             this.graphics.fillRoundedRect(5, this.player.y+200, 880, 165, 20);
             this.graphics.fillStyle(0x629ba0, 2);
             this.graphics.fillRoundedRect(25, this.player.y+205, 850, 155, 20);
             this.snorlaxText=this.add.text(80, this.player.y+220, 'Snor... Snorlax...zZz!', { color: '#000000', align: 'center' }).setFontSize('35px');
             setTimeout(() => {
              this.snorlaxText.destroy();
              this.snorlaxText=this.add.text(80, this.player.y+220, 'Parece que está dormido...', { color: '#000000', align: 'center' }).setFontSize('35px');

             }, 1500);
                 setTimeout(() => {
                  this.graphics.destroy();
                   this.snorlaxxEvent=false;
                   this.snorlaxText.destroy();
                 }, 3000);
               
               this.isTyping=true
         }
     }
       );

     this.entradaTorre = this.physics.add
       .staticGroup({
         key: "fence",
         repeat: 0,
         setXY: { x: 895, y: 190, stepY: 30 },
       })
       .scaleXY(0.5).setVisible(false)
       .setVisible(false);
   this.physics.add.collider(this.player, this.entradaTorre, () => {
     this.scene.sleep("mainScene");
     this.music.stop();
     this.scene.start("escenaTorre",this);
     });




      //Todas las colisiones con el mapa
      this.physics.add.collider(this.player, [
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 7,
            setXY: { x: 460, y: 570, stepY: 35 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 7,
            setXY: { x: 460, y: 850, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 800, y: 750, stepY: 30 },
          }).scaleXY(0.5).setVisible(false),
          this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 4,
            setXY: { x: 100, y: 660, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
  
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 6,
            setXY: { x: 150, y: 540, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
  
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 100, y: 550, stepY: 30 },
          })
          .scaleXY(0.5).setVisible(false),
  
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 280, y: 700, stepY: 40 },
          })
          .scaleXY(0.5).setVisible(false),
  
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 0,
            setXY: { x: 220, y: 780, stepX: 40 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 3,
            setXY: { x: 190, y: 780, stepY: 40 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 190, y: 940, stepX: 40 },
          })
          .scaleXY(0.5).setVisible(false),
  
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 1,
            setXY: { x: 290, y: 940, stepY: 40 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 290, y: 1040, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
  
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 3,
            setXY: { x: 380, y: 1080, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
  
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 500, y: 1100, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 500, y: 1100, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 570, y: 1100, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 1,
            setXY: { x: 700, y: 1040, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 3,
            setXY: { x: 750, y: 1040, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 3,
            setXY: { x: 885, y: 1080, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 1,
            setXY: { x: 865, y: 1270, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 0,
            setXY: { x: 790, y: 1315, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 750, y: 1365, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 6,
            setXY: { x: 820, y: 1480, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 1110, y: 1370, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 1160, y: 1370, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 1260, y: 1250, stepY: 35 },
          })
          .scaleXY(0.4),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 3,
            setXY: { x: 1090, y: 1190, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 1090, y: 1055, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 2,
            setXY: { x: 1140, y: 1055, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 4,
            setXY: { x: 1240, y: 855, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 4,
            setXY: { x: 1020, y: 855, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false),
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 1,
            setXY: { x: 1020, y: 755, stepY: 45 },
          })
          .scaleXY(0.5).setVisible(false),
          this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 3,
            setXY: { x: 690, y: 470, stepY: 30 },
          })
          .scaleXY(0.5).setVisible(false).setVisible(false)
          ,
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 1,
            setXY: { x: 740, y: 580, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false).setVisible(false)
          ,
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 1,
            setXY: { x: 740, y: 410, stepX: 45 },
          })
          .scaleXY(0.5).setVisible(false).setVisible(false)
         ,
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 17,
            setXY: { x: 960, y: 200, stepY: 30 },
          })
          .scaleXY(0.5).setVisible(false).setVisible(false)
         ,
        this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 4,
            setXY: { x: 830, y: 580, stepY: 30 },
          })
          .scaleXY(0.5).setVisible(false).setVisible(false),
          this.physics.add
          .staticGroup({
            key: "fence",
            repeat: 7,
            setXY: { x: 830, y: 200, stepY: 30 },
          })
          .scaleXY(0.5).setVisible(false)
      ],
      ()=>
      { 
        if (!this.collision.isPlaying) {
          this.collision.play();

        } 
      });
     
	}
  getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}

export default mainScene;