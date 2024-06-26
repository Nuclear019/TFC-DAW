class escenaPokemon extends Phaser.Scene {
	constructor() {
		super("escenaPokemon");
	}

	preload() {
	}

	create(data) {
		// #region Variables
		this.pokemons = data.pokemons;
		this.numPokemon = this.pokemons.length;
		this.game = data.game;
		this.click = this.sound.add("click");
		this.click.setVolume(0.04);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.yesKey = this.input.keyboard.addKey('A');
		this.noKey = this.input.keyboard.addKey('B');


		this.selectedMenu = "0";
		this.selectedMenu2 = null;
		this.isSelectedMenu2 = false;
		this.isBagScene = false;
		// If from battle scene
		if ("isBattleScene" in data) {
			this.switch_pokemon_index = null;
			this.isBattleScene = true;
		}
		// If from bag scene, use potion
		if ("isBagScene" in data) {
			this.isBagScene = true;
		}
		// Empty the bar
		this.lista_equipo_vacio = [null, null, null, null, null, null];
		// Fill the bar
		this.lista_equipo_lleno = [null, null, null, null, null, null];
		// Highlight the bar
		this.pokemon_seleccionado = [null, null, null, null, null, null];
		// Pokemon sprite
		this.equipo_pokemon = [null, null, null, null, null, null];
		// Each Pokemon's hp bar
		this.equipo_pokemon_vida = [null, null, null, null, null, null];
		var background = this.add.image(450, 450, 'background').setScale(1.5);
		// #endregion
		


		if (this.numPokemon > 0) {
			// 0th box
			this.lista_equipo_lleno[0] = this.add.image(225, 350, 'party-0');
			this.lista_equipo_lleno[0].setScale(3);
			// Filled boxes
			for (var i = 1; i < Math.min(this.numPokemon, 6); i++) {
				this.lista_equipo_lleno[i] = this.add.image(600, (250 + (i - 1) * 80), 'party');
				this.lista_equipo_lleno[i].setScale(3);
			}
			// Empty boxes
			for (var i = Math.min(this.numPokemon, 6); i < 6; i++) {
				this.lista_equipo_vacio[i] = this.add.image(600, (250 + (i - 1) * 80), 'party-blank');
				this.lista_equipo_vacio[i].setScale(3);
			}
		} else {
			// 0th box
			this.lista_equipo_vacio[0] = this.add.image(225, 350, 'party-0-blank');
			this.lista_equipo_vacio[0].setScale(3);
			// Empty boxes
			for (var i = 1; i < 6; i++) {
				this.lista_equipo_vacio[i] = this.add.image(400, (150 + (i - 1) * 60), 'party-blank');
				this.lista_equipo_vacio[i].setScale(3);
			}
		}

		// Pokémon seleccionado
		this.pokemon_seleccionado[0] = this.add.image(225, 350, 'party-0-highlighted');
		this.pokemon_seleccionado[0].setScale(3);
		for (var i = 1; i < 6; i++) {
			this.pokemon_seleccionado[i] = this.add.image(600, 250 + ((i - 1) * 80), 'party-highlighted');
			this.pokemon_seleccionado[i].setScale(3);
		}

		//Equipo pokémon
		if (this.numPokemon > 0) {
            //Primer pokémon del equipo
			this.equipo_pokemon[0] = this.add.image(160, 320, "pokemon" + this.pokemons[0]["pokedex"]).setScale(1.3);
            this.add.text(200, 320, this.pokemons[0]["pokemon"], { color: '#ffffff', align: 'center' }).setFontSize('20px');
            this.equipo_pokemon_vida[0] = this.add.image(181, 376, "hp-bar").setOrigin(0);
            this.equipo_pokemon_vida[0].displayWidth = this.pokemons[0]["hp"] / this.pokemons[0]["maxHp"] * 142;

			for (var i = 1; i < this.numPokemon; i++) {
				this.equipo_pokemon[i] = this.add.image(420, 250 + ((i - 1) * 80), "pokemon" + this.pokemons[i]["pokedex"]);
                //Nombre
                this.add.text(450, 230 + ((i - 1) * 80), this.pokemons[i]["pokemon"], { color: '#ffffff', align: 'center' }).setFontSize('17px');
                //Vida
                this.equipo_pokemon_vida[i] = this.add.image(651, 241 + ((i - 1) * 80), "hp-bar").setOrigin(0);
			    this.equipo_pokemon_vida[i].displayWidth = this.pokemons[i]["hp"] / this.pokemons[i]["maxHp"] * 143;
			}
		}

		// Boton salir
		this.selected_cancel = this.add.image(790, 690, 'selected-cancel');
		this.selected_cancel.setScale(3.8);
		var pokeball = this.add.image(660, 690, 'pokeball');
		pokeball.setScale(3.5);
		this.cancelText = this.add.text(770, 675, 'Salir').setFontSize('25px');

		// #region Menu 2 interfaces
		// Bottom left box
		this.bottom_left_box = this.add.graphics();
		this.bottom_left_box.fillStyle(0xdc5436, 1);
		this.bottom_left_box.fillRoundedRect(50, 650, 470, 75, 20);
		this.bottom_left_box.fillStyle(0x629ba0, 1);
		this.bottom_left_box.fillRoundedRect(55, 655, 460, 65, 20);

		// Bottom right box
		this.bottom_right_box = this.add.graphics();
		if (this.isBattleScene) {
			this.bottom_right_box.fillStyle(0xdc5436, 1);
			this.bottom_right_box.fillRoundedRect(530, 555, 165, 165, 20);
			this.bottom_right_box.fillStyle(0x629ba0, 1);
			this.bottom_right_box.fillRoundedRect(535, 560, 155, 155, 20);
		} else {
			this.bottom_right_box.fillStyle(0xdc5436, 1);
			this.bottom_right_box.fillRoundedRect(530, 600, 165, 125, 20);
			this.bottom_right_box.fillStyle(0x629ba0, 1);
			this.bottom_right_box.fillRoundedRect(535, 605, 155, 115, 20);
		}

		// Other interfaces
		this.bottom_left_text = this.add.text(100, 660, 'Que quieres hacer con \neste pokemon?', { color: "#000000" }).setFontSize('25px');
		if (this.isBattleScene) {
			this.shift_text = this.add.text(555, 570, 'Cambiar', { color: '#000000' }).setFontSize('30px');
			
		}
		this.Datos_test = this.add.text(555, 620, 'Datos', { color: '#000000' }).setFontSize('30px');
		this.cancel_test = this.add.text(555,670, 'Salir', { color: '#000000' }).setFontSize('30px');
		this.menuPointer = this.add.polygon(550, 500, [0, 0, 0, 20, 10, 10], 0x636363);
		// #endregion

		this.setMenu2(false);

		this.dehighlightAll();
		if (this.numPokemon > 0) {
			this.pokemon_seleccionado[0].setVisible(true);
		}

	}

	left() {
		this.isLeftPress = true;
	}
	right() {
		this.isRightPress = true;
	}
	up() {
		this.isUpPress = true;
	}
	down() {
		this.isDownPress = true;
	}
	yes() {
		this.isYesPress = true;
	}
	no() {
		this.isNoPress = true;
	}
	enter() {
		this.isEnterPress = true;
	}

	switchPokemon() {
		this.switch_pokemon_index = parseInt(this.selectedMenu);
		// Don't allow switching if this Pokemon is fainted
		if(this.pokemons[this.switch_pokemon_index]["hp"] <= 0) {
			this.bottom_left_text.setText("El pokémon está debilitado");
		} else {
			this.game.scene.getScene("escenaCombate").isFromPokemonScene = true;
			this.game.scene.getScene("escenaCombate").currentPokemonIndex = this.switch_pokemon_index;
			this.game.scene.getScene("escenaCombate").currentMenu = "Menu";
			this.game.scene.getScene("escenaCombate").selectedMenu = "Fight";
			this.game.scene.stop("escenaPokemon");
			this.game.scene.run("escenaCombate");
			this.game.scene.getScene("escenaCombate").summonPokemon();
		}
	}

	update(time, delta) {
		// Press down
		if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || this.isDownPress) {
			this.click.play();

			// If Menu 2 is on
			if (this.isSelectedMenu2) {
				// If is battle scene
				if (this.isBattleScene) {
					switch (this.selectedMenu2) {
						case "Cambiar":
							this.menuPointer.y += 50;
							this.selectedMenu2 = "Datos";
							break;
						case "Datos":
							this.menuPointer.y += 50;
							this.selectedMenu2 = "Salir";
							break;
						case "Salir":
							this.menuPointer.y -= 100;
							this.selectedMenu2 = "Cambiar";

							break;
					}
				} else {
					switch (this.selectedMenu2) {
						case "Datos":
							this.menuPointer.y += 50;
							this.selectedMenu2 = "Salir";
							break;
						case "Salir":
							break;
					}
				}
			} else {
				this.dehighlightAll();
				if (this.selectedMenu != Math.min(this.numPokemon, 6) - 1 && this.selectedMenu != "Salir") {
					this.selectedMenu = (parseInt(this.selectedMenu) + 1).toString();
					this.pokemon_seleccionado[parseInt(this.selectedMenu)].setVisible(true);
				}
				else if (this.selectedMenu == Math.min(this.numPokemon, 6) - 1) {
					this.selectedMenu = "Salir";
					this.selected_cancel.setVisible(true);
				}
				else if (this.selectedMenu == "Salir") {
					this.selectedMenu = "0";
					this.pokemon_seleccionado[parseInt(this.selectedMenu)].setVisible(true);
				}
			}
			this.isDownPress = false;
		}
		// Press up
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || this.isUpPress) {
			this.click.play();

			// If Menu 2 is on
			if (this.isSelectedMenu2) {
				// If is battle scene
				if (this.isBattleScene) {
					switch (this.selectedMenu2) {
						case "Cambiar":
							this.menuPointer.y += 100;
							this.selectedMenu2 = "Salir";

							break;
						case "Datos":
							this.menuPointer.y -= 50;
							this.selectedMenu2 = "Cambiar";
							break;
						case "Salir":
							this.menuPointer.y -= 50;
							this.selectedMenu2 = "Datos";
							break;
					}
				} else {
					switch (this.selectedMenu2) {
						case "Datos":
							break;
						case "Salir":
							this.menuPointer.y -= 50;
							this.selectedMenu2 = "Datos";
							break;
					}
				}
			}
			else {
				this.dehighlightAll();
				if (this.selectedMenu != 0 && this.selectedMenu != "Salir") {
					this.selectedMenu = (parseInt(this.selectedMenu) - 1).toString();
					this.pokemon_seleccionado[parseInt(this.selectedMenu)].setVisible(true);
				}
				else if (this.selectedMenu == 0) {
					this.selectedMenu = "Salir";
					this.selected_cancel.setVisible(true);
				}
				else if (this.selectedMenu == "Salir") {
					this.selectedMenu = (Math.min(this.numPokemon, 6) - 1).toString();
					this.pokemon_seleccionado[parseInt(this.selectedMenu)].setVisible(true);
				}
			}
			this.isUpPress = false;
		}
		// Press left
		else if ((Phaser.Input.Keyboard.JustDown(this.cursors.left) || this.isLeftPress) && !this.isSelectedMenu2) {
			this.click.play();

			this.dehighlightAll();
			if (this.selectedMenu in ["1", "2", "3", "4", "5"]) {
				this.selectedMenu = "0";
				this.pokemon_seleccionado[0].setVisible(true);
			}
			this.isLeftPress = false;
		}
		// Press right
		else if ((Phaser.Input.Keyboard.JustDown(this.cursors.right) || this.isRightPress) && !this.isSelectedMenu2) {
			this.click.play();

			this.dehighlightAll();
			if (this.selectedMenu in ["0"]) {
				if (this.numPokemon >= 2) {
					this.selectedMenu = "1";
					this.pokemon_seleccionado[1].setVisible(true);
				}
			}
			this.isRightPress = false;
		}
		// Press yes
		else if (Phaser.Input.Keyboard.JustDown(this.yesKey) || this.isYesPress) {
			this.click.play();

			// If Menu 2 is on
			if (this.isSelectedMenu2) {
				switch (this.selectedMenu2) {
					case "Salir":
						this.setMenu2(false);
						this.isSelectedMenu2 = false;
						break;
					case "Datos":
					this.game.scene.stop('escenaPokemon');
					this.game.scene.run('escenaInfoPokemon',this);
						break;
					case "Cambiar":
						this.switchPokemon();
						break;
				}
			} else {
				// If at Menu 1's Cancel
				if (this.selectedMenu == "Salir") {
                    if (this.isBattleScene) {
                        this.game.scene.stop('escenaPokemon');
					this.game.scene.run('escenaCombate');
                    }
					else{
                        this.game.scene.stop('escenaPokemon');
					this.game.scene.run('mainScene');
                    }
				}
				// If from bag scene, use potion for this Pokemon/ heal Pokemon
				else if (this.isBagScene) {
					if (this.selectedMenu != "Salir") {
						this.pokemons[parseInt(this.selectedMenu)]["hp"] += 40;
						if (this.pokemons[parseInt(this.selectedMenu)]["hp"] > 100) this.pokemons[parseInt(this.selectedMenu)]["hp"] = 100;
						this.tweens.add({
							targets: this.equipo_pokemon_vida[parseInt(this.selectedMenu)],
							displayWidth: this.pokemons[parseInt(this.selectedMenu)]["hp"] / this.pokemons[parseInt(this.selectedMenu)]["maxHp"] * (this.selectedMenu == "0" ? 97 : 122),
							duration: 200,
							repeat: 0,
							loop: 0,
							yoyo: false,
							onComplete: function () {
								this.game.scene.stop("escenaPokemon");
								this.game.scene.run("escenaMochila", this);
							},
							onCompleteScope: this
						});
					} else {
						this.game.scene.stop("escenaMochila");
						this.game.scene.getScene("escenaCombate").setOwnPokemonHP();
						this.game.scene.run("escenaCombate");
					}
				}
				// Show menu 2 for this Pokemon
				else {
					this.setMenu2(true);
					if (this.isBattleScene) {
						this.selectedMenu2 = "Cambiar";
					} else {
						this.selectedMenu2 = "Datos";
					}
					this.isSelectedMenu2 = true;
				}
			}
			this.isYesPress = false;
		}
		// Press no
		else if (Phaser.Input.Keyboard.JustDown(this.noKey) || this.isNoPress) {
			// If Menu 2 is on
			if (this.isSelectedMenu2) {
				this.setMenu2(false);
				this.isSelectedMenu2 = false;
			} else {
				if (this.isBattleScene) {
					this.game.scene.stop('pokemonScene');
					this.game.scene.getScene("escenaCombate").setOwnPokemonHP();
					this.game.scene.run("escenaCombate");
				} else {
					this.game.scene.stop('escenaPokemon');
					this.game.scene.run('mainScene');
				}
			}
			this.isNoPress = true;
		}
	}

	setMenu2(flag) {
		this.bottom_left_box.setVisible(flag);
		this.bottom_right_box.setVisible(flag);
		this.bottom_left_text.setVisible(flag);
		if (this.isBattleScene) {
			this.shift_text.setVisible(flag);
		}
		this.Datos_test.setVisible(flag);
		this.cancel_test.setVisible(flag);
		this.menuPointer.setVisible(flag);
		if (flag == true) {
			this.menuPointer.x = 550;
			this.menuPointer.y = 585;
			this.bottom_left_text.setText("Que quieres hacer con \neste pokemon?");
		}
		if (!this.isBattleScene) {
			this.menuPointer.y += 50;
		}
	}

	dehighlightAll() {
		for (var i = 0; i < 6; i++) {
			this.pokemon_seleccionado[i].setVisible(false);
		}
		this.selected_cancel.setVisible(false);
	}
}
export default escenaPokemon;