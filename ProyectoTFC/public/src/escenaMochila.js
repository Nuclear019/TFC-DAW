class escenaMochila extends Phaser.Scene {
	constructor() {
		super("escenaMochila");
	}

	preload() {
		this.load.image("potion", "./assets/images/potion.png");
	}

	create(data) {
		// Variables
		this.numOptions = 2;
		this.isOption2On = false;
		this.selectedOption = 0;
		this.selectedOption2 = 0;
		this.isBagScene = true;
		this.pokemons = data.pokemons;
		this.isTyping = false;


		this.isMainScene = false;
		if ("isMainScene" in data) {
			this.isMainScene = true;
		}

		// Cursors
		this.cursors = this.input.keyboard.createCursorKeys();
		this.yesKey = this.input.keyboard.addKey('A');
		this.noKey = this.input.keyboard.addKey('B');


		// Interfaces
		this.add.image(450, 400, 'bag-background').setScale(3.5);
		this.menuPointer = this.add.polygon(450, 200, [0, 0, 0, 20, 10, 10], 0x636363);
		this.item = this.add.text(475, 190, 'POCIÓN', { color: '#000000' }).setFontSize('30px');
		this.potion=this.add.image(95, 410, 'potion').setScale(0.2);

		// #region Menu option 2
		// Menu bottom right chat bubbles
		this.option2_menu = this.add.graphics();
		this.option2_menu.fillStyle(0xdc5436, 1);
		this.option2_menu.fillRoundedRect(400, 380, 190, 115, 20);
		this.option2_menu.fillStyle(0x629ba0, 1);
		this.option2_menu.fillRoundedRect(405, 385, 180, 105, 20);

		// Menu bottom right text
		this.menuPointer2 = this.add.polygon(420, 417, [0, 0, 0, 20, 10, 10], 0x636363);
		this.use_text = this.add.text(430, 405, 'USAR', { color: '#000000' }).setFontSize('30px');
		this.cancel_text = this.add.text(430, 445, 'SALIR', { color: '#000000' }).setFontSize('30px');
		this.setMenu2(false);
		// Botón salir
		this.selected_cancel = this.add.image(790, 690, 'selected-cancel');
		this.selected_cancel.setScale(3.8);
		var pokeball = this.add.image(660, 690, 'pokeball');
		pokeball.setScale(3.5);
		this.cancelText = this.add.text(770, 675, 'Salir').setFontSize('25px');

	}

	setMenu2(flag) {
		this.menuPointer2.setVisible(flag);
		this.use_text.setVisible(flag);
		this.cancel_text.setVisible(flag);
		this.option2_menu.setVisible(flag);
		if (flag) {
			this.isOption2On = true;
			this.menuPointer2.x = 420;
			this.menuPointer2.y = 417;
			this.selectedOption2 = 0;
		} else {
			this.isOption2On = false;
		}
	}

	update(time, delta) {
		if (Phaser.Input.Keyboard.JustDown(this.yesKey) || this.isYesPress) {
			// If menu is on
			if (this.isOption2On) {
				switch (this.selectedOption2) {
					// Use
					case 0:
						switch (this.selectedOption) {
							// Potion
							case 0:
								this.setMenu2(false);
								this.game.scene.sleep('escenaMochila');
								this.game.scene.run('escenaPokemon', this);
								this.isYesPress = false;
								break;
							
						}
						break;
					// Cancel
					case 1:
						this.setMenu2(false);
						this.isYesPress = false;
						break;
				}
			}
		}
		// Press no
		else if (Phaser.Input.Keyboard.JustDown(this.noKey) || this.isNoPress) {
			// If menu is on
			if (this.isOption2On) {
				this.setMenu2(false);
				this.isNoPress = false;
			}
			// If menu is not on
			else {
				this.game.scene.stop('escenaMochila');
				if (this.isMainScene) {
					this.game.scene.run('mainScene', this);
					this.isNoPress = false;
				} else {
					this.game.scene.getScene('escenaCombate').setOwnPokemonHP();
					this.game.scene.run('escenaCombate', this);
					this.isNoPress = false;
				}
			}
		}
	}
}
export default escenaMochila;
