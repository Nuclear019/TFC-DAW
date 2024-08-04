
class escenaCombate extends Phaser.Scene {
  constructor() {
    super("escenaCombate");
  }

  preload() {
    this.load.audio("battle0", ["./assets/audio/battle0.mp3"]);
    this.load.audio("battle1", ["./assets/audio/battle1.mp3"]);
    this.load.audio("battle2", ["./assets/audio/battle2.mp3"]);
    this.load.audio("battle3", ["./assets/audio/battle3.mp3"]);
    this.load.audio("battle4", ["./assets/audio/battle4.mp3"]);
    this.load.audio("winning", ["./assets/audio/winning.mp3"]);
    this.load.audio("fainted", ["./assets/audio/fainted.wav"]);
    this.load.audio("damage", ["./assets/audio/damage.wav"]);
  }

  create(data) {
    // Variables
    this.pokedexData = data.pokedexData;
    this.pokemon_rarity_cumulative = data.pokemon_rarity_cumulative;
    this.pokemons = data.pokemons;
    this.moves = data.moves;
    this.currentPokemonIndex = -1;
    this.menuInitialized = false;
    this.isTyping = false;
    this.isAttacking = false;
    this.isBattleScene = true;
    this.ownPokemon = null;
    this.pauseCursor = false;
    this.numMoves = data.numMoves;
    this.tempMoves = data.tempMoves;
    this.typeMoves = data.typeMoves;
    this.selectedMenu = "Fight";
    this.currentMenu = "Menu";
    this.cursors = this.input.keyboard.createCursorKeys();
    this.yesKey = this.input.keyboard.addKey("A");
    this.noKey = this.input.keyboard.addKey("B");
    this.isFromPokemonScene = false;
    this.equipoRival = 2;
    this.numeroRonda = data.numeroRonda;
    const random = Math.floor(Math.random() * 4);
    this.battleSound = this.sound.add(`battle${random}`);
    this.winSound = this.sound.add("winning");
    this.damageSound = this.sound.add("damage");
    this.faintSound = this.sound.add("fainted");
    this.damageSound.setVolume(0.2);
    this.faintSound.setVolume(0.2);

    this.sound.pauseOnBlur = true;
    this.enCombate = true;

    // Determine which wild pokemon
    var d = Math.random();
    var cumulative =
      d *
      this.pokemon_rarity_cumulative[this.pokemon_rarity_cumulative.length - 1];
    this.wild_pokemon_index;
    for (let i = 0; i < 151; i++) {
      if (this.pokemon_rarity_cumulative[i] >= cumulative) {
        this.wild_pokemon_index = i;
        break;
      }
    }

    // Choose 4 moves for this wild Pokemon
    this.opponent_pokemon_types =
      this.pokedexData[this.wild_pokemon_index]["type"];
    this.opponent_pokemon_moves = [];
    this.opponent_pokemon_num_types = this.opponent_pokemon_types.length;
    for (var i = 0; i < 4; i++) {
      do {
        var move_type_index = this.getRandomInt(
          0,
          this.opponent_pokemon_num_types - 1
        );
        var type = this.opponent_pokemon_types[move_type_index];
        if (!(type in this.typeMoves)) {
          continue;
        }
        var num_moves = this.typeMoves[type].length;
        var move_index = this.getRandomInt(0, num_moves - 1);
        var move = this.typeMoves[type][move_index];
        this.opponent_pokemon_moves.push([move["ename"], move["pp"]]);
      } while (!(type in this.typeMoves));
    }
    console.log(this.opponent_pokemon_moves);
    console.log(this.pokemons);

    // Wild Pokemon
    this.opponentPokemon = {
      pokemon: this.pokedexData[this.wild_pokemon_index]["name"]["english"],
      moves: this.opponent_pokemon_moves,
      hp: 100,
      maxHp: 100,
      pokedex: this.wild_pokemon_index + 1,
    };

    // Choose non fainted own Pokemon
    this.numPokemon = this.pokemons.length;
    for (let i = 0; i < this.numPokemon; i++) {
      if (this.pokemons[i]["hp"] > 0) {
        this.currentPokemonIndex = i;
        break;
      }
    }

    // TODO: All pokemon fainted, no battle
    if (this.currentPokemonIndex == -1) {
    }

    // Interfaces
    var background = this.add
      .image(450, 450, "battle-background")
      .setScale(1.6);
    var own_pokemon_bar = this.add.image(745, 500, "battle-bar");
    var opponent_pokemon_bar = this.add
      .image(178, 290, "opponent-battle-bar")
      .setScale(1.2);

    this.own_pokemon_hp_bar = this.add
      .image(730, 495, "hp-bar")
      .setOrigin(0)
      .setScale(1.2);
    this.own_pokemon_hp_bar.displayWidth =
      (this.pokemons[this.currentPokemonIndex]["hp"] /
        this.pokemons[this.currentPokemonIndex]["maxHp"]) *
      147;
    this.opponent_pokemon_hp_bar = this.add
      .image(137, 297, "hp-bar")
      .setOrigin(0)
      .setScale(1.5);
    this.opponent_pokemon_hp_bar.displayWidth =
      (this.opponentPokemon["hp"] / this.opponentPokemon["maxHp"]) * 168;

    this.own_pokemon_name_text = this.add
      .text(630, 460, this.pokemons[this.currentPokemonIndex]["pokemon"], {
        color: "#000000",
      })
      .setFontSize("25px");
    this.opponent_pokemon_name_text = this.add
      .text(44, 260, this.opponentPokemon["pokemon"], { color: "#000000" })
      .setFontSize("25px");
    this.own_pokemon_hp_text = this.add
      .text(
        750,
        510,
        this.pokemons[this.currentPokemonIndex]["hp"] +
          "/" +
          this.pokemons[this.currentPokemonIndex]["maxHp"],
        { color: "#000000" }
      )
      .setFontSize("25px");

    // Bottom chat bubbles
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0xdc5436, 1);
    this.graphics.fillRoundedRect(5, 570, 880, 165, 20);
    this.graphics.fillStyle(0x629ba0, 1);
    this.graphics.fillRoundedRect(25, 575, 850, 155, 20);

    // Bottom text
    var pokemonName = this.pokemons[this.currentPokemonIndex]["pokemon"];
    this.typing_4 = this.initializeTyping();
    this.typing = this.initializeTyping();
    this.typing.on("complete", () => {
      setTimeout(() => {
        this.isTyping = false;
        this.typing.start("");
        // Summon Pokemon
        this.summonPokemon();
        this.opponent_pokemon_sprite = this.add
          .image(630, 350, "pokemon" + (this.wild_pokemon_index + 1).toString())
          .setScale(3.0);
      }, 2000);
    });
    this.typing.start(
      "El rival saca a " +
        this.pokedexData[this.wild_pokemon_index]["name"]["english"] +
        "!"
    );

    // Wild Pokemon sprite

    this.openingSequence();
  }

  openingSequence() {
    this.openingTop = this.add.rectangle(450, 450, 900, 900, 0x000000);
    this.openingBottom = this.add.rectangle(450, 450, 900, 900, 0x000000);
    this.openingBottom.angle = 180;
    this.tweens.add({
      targets: this.openingTop,
      height: 0,
      duration: 1000,
    });
    this.tweens.add({
      targets: this.openingBottom,
      height: 0,
      duration: 1000,
    });
  }

  setOwnPokemonHP() {
    this.own_pokemon_hp_text.setText(
      this.pokemons[this.currentPokemonIndex]["hp"] +
        "/" +
        this.pokemons[this.currentPokemonIndex]["maxHp"]
    );
    this.own_pokemon_hp_bar.displayWidth =
      (this.pokemons[this.currentPokemonIndex]["hp"] /
        this.pokemons[this.currentPokemonIndex]["maxHp"]) *
      147;
  }

  summonPokemon() {
    // Destroy existing own Pokemon sprite
    if (this.ownPokemon != null) {
      this.ownPokemon.destroy();
    }

    // Choose first non-fainted Pokemon
    if (!this.isFromPokemonScene) {
      for (var i = 0; i < this.pokemons.length; i++) {
        if (this.pokemons[i]["hp"] > 0) {
          this.currentPokemonIndex = i;
          break;
        }
      }
    }

    // From Pokemon scene (switch pokemon) or If already existing Pokemon, switch to next non-fainted Pokemon
    if (this.isFromPokemonScene || this.ownPokemon != null) {
      if (this.isFromPokemonScene) {
        this.opponentPokemonMove();
      }
      this.own_pokemon_name_text.setText(
        this.pokemons[this.currentPokemonIndex]["pokemon"]
      );
      this.own_pokemon_hp_text.setText(
        this.pokemons[this.currentPokemonIndex]["hp"] +
          "/" +
          this.pokemons[this.currentPokemonIndex]["maxHp"]
      );
      this.own_pokemon_hp_bar.displayWidth =
        (this.pokemons[this.currentPokemonIndex]["hp"] /
          this.pokemons[this.currentPokemonIndex]["maxHp"]) *
        147;
      this.isFromPokemonScene = false;
    }

    // Typing
    this.typing_4.start(
      "Adelante " + this.pokemons[this.currentPokemonIndex]["pokemon"] + "!"
    );
    if (this.menu) {
      this.setMenu(false);
      this.setPointer(false);
    }

    this.pauseCursor = true;
    // #region Summon own pokemon
    // Pokemon to summon
    this.ownPokemon = this.add
      .image(
        230,
        500,
        "pokemon-back" +
          this.pokemons[this.currentPokemonIndex]["pokedex"].toString()
      )
      .setScale(2.5);

    this.typing_4.start("");
    this.initializeMenu();
    this.initializePPMenu();
    this.setPPMenu(false);
    this.initializePointer();
    this.setMenu(true);
    this.pauseCursor = false;
    // #endregion
    // #endregion
  }

  initializeTyping() {
    this.isTyping = true;
    this.bottom_text = this.add.text(35, 600, "").setFontSize("25px");
    return this.plugins
      .get("rexTextTyping")
      .add(this.bottom_text, { speed: 50 });
  }

  initializeMenu() {
    if (this.menu != null) {
      this.menu.destroy();
      this.fightText.destroy();
      this.pokemonText.destroy();
      this.textoMochila.destroy();
      this.runText.destroy();
      this.menuInitialized = true;
    }
    this.menu = this.add.rectangle(650, 653, 450, 155, 0xffffff);
    this.fightText = this.add
      .text(450, 600, "LUCHAR", { color: "#000000" })
      .setFontSize("40px");
    this.pokemonText = this.add
      .text(450, 660, "POKéMON", { color: "#000000" })
      .setFontSize("40px");
    this.textoMochila = this.add
      .text(650, 600, "MOCHILA", { color: "#000000" })
      .setFontSize("40px");
    this.runText = this.add
      .text(650, 660, "HUIR", { color: "#000000" })
      .setFontSize("40px");
    this.menuInitialized = true;
  }

  initializePPMenu() {
    if (this.moveMenu != null) {
      this.moveMenu.destroy();
      this.moveMenu.destroy();
      this.ppMenu.destroy();
      this.move_1_text.destroy();
      this.move_2_text.destroy();
      this.move_3_text.destroy();
      this.move_4_text.destroy();
      this.pp_text.destroy();
      this.pp_count_text.destroy();
      this.pp_type_text.destroy();
    }
    this.moveMenu = this.add.rectangle(320, 653, 600, 155, 0xffffff);
    this.ppMenu = this.add.rectangle(745, 653, 257, 155, 0xffffff);
    this.move_1_text = this.add
      .text(50, 600, this.pokemons[this.currentPokemonIndex]["moves"][0][0], {
        color: "#000000",
      })
      .setFontSize("32px");
    this.move_2_text = this.add
      .text(50, 660, this.pokemons[this.currentPokemonIndex]["moves"][1][0], {
        color: "#000000",
      })
      .setFontSize("32px");
    this.move_3_text = this.add
      .text(350, 600, this.pokemons[this.currentPokemonIndex]["moves"][2][0], {
        color: "#000000",
      })
      .setFontSize("32px");
    this.move_4_text = this.add
      .text(350, 660, this.pokemons[this.currentPokemonIndex]["moves"][3][0], {
        color: "#000000",
      })
      .setFontSize("32px");
    this.pp_text = this.add
      .text(650, 600, "PP", { color: "#000000" })
      .setFontSize("20px");
    this.pp_count_text = this.add
      .text(
        670,
        600,
        this.pokemons[this.currentPokemonIndex]["moves"][0][1] + "/15",
        { color: "#000000" }
      )
      .setFontSize("25px");
    this.pp_type_text = this.add
      .text(650, 660, this.pokemons[this.currentPokemonIndex]["moves"][0][2], {
        color: "#000000",
      })
      .setFontSize("20px");
  }

  initializePointer() {
    if (this.menuPointer != null) {
      this.menuPointer.destroy();
    }
    this.menuPointer = this.add.polygon(
      440,
      615,
      [0, 0, 0, 20, 10, 10],
      0x636363
    );
  }

  setMenu(flag) {
    this.menu.setVisible(flag);
    this.fightText.setVisible(flag);
    this.pokemonText.setVisible(flag);
    this.textoMochila.setVisible(flag);
    this.runText.setVisible(flag);
    this.menuPointer.setVisible(flag);
    if (flag) {
      this.setPointer(true);
      this.menuPointer.x = 440;
      this.menuPointer.y = 615;
      this.currentMenu = "Menu";
      this.selectedMenu = "Fight";
    }
  }

  setPPMenu(flag) {
    this.moveMenu.setVisible(flag);
    this.ppMenu.setVisible(flag);
    this.move_1_text.setVisible(flag);
    this.move_2_text.setVisible(flag);
    this.move_3_text.setVisible(flag);
    this.move_4_text.setVisible(flag);
    this.pp_text.setVisible(flag);
    this.pp_count_text.setVisible(flag);
    this.pp_type_text.setVisible(flag);
  }

  setPointer(flag) {
    this.menuPointer.setVisible(flag);
  }

  attack(move_no) {
    this.setPPMenu(false);
    this.setPointer(false);
    // Own pokemon move
    if (this.pokemons[this.currentPokemonIndex]["moves"][move_no][1] == 0) {
      // No more PP left
      this.typing_2 = this.initializeTyping();
      this.typing_2.start("No PP left.").on("complete", () => {
        this.setMenu(true);
        this.isAttacking = false;
        this.typing_2.start("");
        this.isTyping = false;
      });
    } else {
      this.move = this.pokemons[this.currentPokemonIndex]["moves"][move_no][0];
      this.pokemons[this.currentPokemonIndex]["moves"][move_no][1] -= 1;
      this.typing_2 = this.initializeTyping();
      this.typing_2
        .start(
          this.pokemons[this.currentPokemonIndex]["pokemon"] +
            " uses " +
            this.move
        )
        .on("complete", () => {
          this.typing_2.start("");
          setTimeout(() => {
            this.damageSound.play();
          }, 700);

          // Animation
          this.own_pokemon_battle_tween = this.tweens.add({
            targets: this.ownPokemon,
            x: this.ownPokemon.x + 20,
            y: this.ownPokemon.y - 20,
            duration: 200,
            repeat: 0,
            loop: 0,
            yoyo: true,
            onComplete: function () {
              this.opponentPokemon["hp"] -= this.moves[this.move]["power"];
              if (this.opponentPokemon["hp"] < 0) {
                this.opponentPokemon["hp"] = 0;
              }

              this.tweens.add({
                targets: this.opponent_pokemon_hp_bar,
                displayWidth:
                  (this.opponentPokemon["hp"] / this.opponentPokemon["maxHp"]) *
                  143,
                duration: 800,
                yoyo: false,
                repeat: 0,
                onComplete: function () {
                  // Opponent pokemon move
                  if (this.opponentPokemon["hp"] <= 0) {
                    this.opponentPokemonFaint();
                  } else {
                    this.opponentPokemonMove();
                  }
                },
                onCompleteScope: this,
              });
            },
            onCompleteScope: this,
          });
        });
    }
  }

  opponentPokemonMove() {
    // Oponent move
    var d = this.getRandomInt(0, 3);
    this.move = this.opponentPokemon["moves"][d][0];
    this.typing_3 = this.initializeTyping();
    this.typing_3
      .start(this.opponentPokemon["pokemon"] + " uses " + this.move)
      .on("complete", () => {
        this.isTyping = false;
        this.typing_3.start("");
        setTimeout(() => {
          this.damageSound.play();
        }, 700);
        // Opponent animation
        this.tweens.add({
          targets: this.opponent_pokemon_sprite,
          x: this.opponent_pokemon_sprite.x - 20,
          y: this.opponent_pokemon_sprite.y + 20,
          duration: 200,
          repeat: 0,
          loop: 0,
          yoyo: true,
          onComplete: function () {
            // Reduce own hp
            if (this.moves[this.move]["power"] == null) {
              this.moves[this.move]["power"] = 40;
            }
            this.pokemons[this.currentPokemonIndex]["hp"] -=
              this.moves[this.move]["power"];
            if (this.pokemons[this.currentPokemonIndex]["hp"] < 0) {
              this.pokemons[this.currentPokemonIndex]["hp"] = 0;
            }
            this.own_pokemon_hp_text.setText(
              this.pokemons[this.currentPokemonIndex]["hp"] +
                "/" +
                this.pokemons[this.currentPokemonIndex]["maxHp"]
            );
            // Hp bar animation
            this.tweens.add({
              targets: this.own_pokemon_hp_bar,
              displayWidth:
                (this.pokemons[this.currentPokemonIndex]["hp"] /
                  this.pokemons[this.currentPokemonIndex]["maxHp"]) *
                147,
              duration: 800,
              yoyo: false,
              repeat: 0,
              onComplete: function () {
                // Own pokemon fainted
                if (this.pokemons[this.currentPokemonIndex]["hp"] <= 0) {
                  this.pokemons[this.currentPokemonIndex]["hp"] = 0;
                  this.ownPokemonFaint();
                } else {
                  this.setMenu(true);
                  this.isAttacking = false;
                }
                console.log(
                  this.pokemons[this.currentPokemonIndex]["hp"],
                  this.opponentPokemon["hp"]
                );
              },
              onCompleteScope: this,
            });
          },
          onCompleteScope: this,
        });
      });
  }
  ownPokemonFaint() {
    this.tweens.add({
      targets: this.ownPokemon,
      y: this.ownPokemon.y + 100,
      duration: 200,
      yoyo: false,
      onComplete: function () {
        this.faintSound.play();
        this.ownPokemon.setVisible(false);
        this.own_pokemon_faint_text = this.initializeTyping();
        this.own_pokemon_faint_text.on("complete", () => {
          this.isTyping = false;
          this.own_pokemon_faint_text.start("");
        });
        this.own_pokemon_faint_text.start(
          this.pokemons[this.currentPokemonIndex]["pokemon"] + " fainted!"
        );
        this.own_pokemon_faint_text.on("complete", () => {
          this.isAttacking = false;

          this.pauseCursor = true;

          // Check if black out
          var blackout = true;
          for (var i = 0; i < this.pokemons.length; i++) {
            if (this.pokemons[i]["hp"] > 0) {
              blackout = false;
              break;
            }
          }

          // Blackout
          if (blackout) {
            

            this.typing_6 = this.initializeTyping();
            this.typing_6.on("complete", () => {
              this.menu.setVisible(false);
              this.fightText.setVisible(false);
              this.pokemonText.setVisible(false);
              this.textoMochila.setVisible(false);
              this.runText.setVisible(false);
              this.menuPointer.setVisible(false);
              
              this.enCombate = false;

                this.battleSound.stop();
              this.typing_6.start("");

              this.typing_7 = this.initializeTyping();
              this.typing_7.on("complete", () => {
                // TODO: Blackout screen
                this.pauseCursor = false;
              });

              this.typing_7
                .start("Tu participación ha finalizado.")
                .on("complete", () => {
                  this.game.scene.stop("escenaCombate");
                  this.game.scene.run("mainScene", this);
                });
            });
            this.typing_6.start("Todos tus pokemons están debilitados.");
          }
          // Switch to another Pokemon
          else {
            this.summonPokemon();
          }
        });
      },
      onCompleteScope: this,
    });
  }

  opponentPokemonFaint() {
    this.tweens.add({
      targets: this.opponent_pokemon_sprite,
      y: this.opponent_pokemon_sprite.y + 100,
      duration: 200,
      yoyo: false,
      onComplete: function () {
        this.faintSound.play();
        this.opponent_pokemon_sprite.setVisible(false);
        this.opponent_pokemon_faint_text = this.initializeTyping();
        this.opponent_pokemon_faint_text.start(
          "Has derrotado a " + this.opponentPokemon["pokemon"] + " !"
        );

        this.opponent_pokemon_faint_text.on("complete", () => {
          if (this.equipoRival == 0) {
            this.enCombate = false;
            this.battleSound.stop();

            this.isTyping = false;
			this.winSound.play();

			setTimeout(() => {
            this.opponent_pokemon_faint_text
              .start("Enhorabuena has pasado a la siguiente ronda!")
              .on("complete", () => {
                this.opponent_pokemon_faint_text.start("");
				this.winSound.stop();
                this.numeroRonda++;
                setTimeout(() => {
                  this.game.scene.stop("escenaCombate");
                  this.game.scene.run("escenaTorre", this);
                }, 1000);
              });
			}, 1000);
			
          } else {
            this.opponent_pokemon_faint_text.start("");
            this.equipoRival--;
            this.siguientePokemonRival();
          }
        });
        this.isAttacking = false;
      },
      onCompleteScope: this,
    });
  }

  update(time, delta) {
    if (!this.battleSound.isPlaying && this.enCombate == true) {
      this.battleSound.play();
      this.battleSound.setVolume(0.04);
    }
    if (
      this.menuInitialized &&
      !this.isTyping &&
      !this.isAttacking &&
      !this.pauseCursor
    ) {
      if (
        Phaser.Input.Keyboard.JustDown(this.cursors.down) ||
        this.isDownPress
      ) {
        if (this.currentMenu == "Menu") {
          if (this.selectedMenu == "Fight") {
            this.selectedMenu = "Pokemon";
            this.menuPointer.y += 60;
          } else if (this.selectedMenu == "Mochila") {
            this.selectedMenu = "Run";
            this.menuPointer.y += 60;
          }
        } else if (this.currentMenu == "Fight") {
          if (this.selectedMenu == "Move 1") {
            this.selectedMenu = "Move 2";
            this.menuPointer.y += 60;
            this.pp_count_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][1][1] + "/15"
            );
            this.pp_type_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][1][2]
            );
          } else if (this.selectedMenu == "Move 3") {
            this.selectedMenu = "Move 4";
            this.menuPointer.y += 60;
            this.pp_count_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][3][1] + "/15"
            );
            this.pp_type_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][3][2]
            );
          }
        }
        this.isDownPress = false;
      } else if (
        Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
        this.isUpPress
      ) {
        if (this.currentMenu == "Menu") {
          if (this.selectedMenu == "Pokemon") {
            this.selectedMenu = "Fight";
            this.menuPointer.y -= 60;
          } else if (this.selectedMenu == "Run") {
            this.selectedMenu = "Mochila";
            this.menuPointer.y -= 60;
          }
        } else if (this.currentMenu == "Fight") {
          if (this.selectedMenu == "Move 2") {
            this.selectedMenu = "Move 1";
            this.menuPointer.y -= 60;
            this.pp_count_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][0][1] + "/15"
            );
            this.pp_type_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][0][2]
            );
          } else if (this.selectedMenu == "Move 4") {
            this.selectedMenu = "Move 3";
            this.menuPointer.y -= 60;
            this.pp_count_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][2][1] + "/15"
            );
            this.pp_type_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][2][2]
            );
          }
        }
        this.isUpPress = false;
      } else if (
        Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
        this.isLeftPress
      ) {
        if (this.currentMenu == "Menu") {
          if (this.selectedMenu == "Mochila") {
            this.selectedMenu = "Fight";
            this.menuPointer.x -= 200;
          } else if (this.selectedMenu == "Run") {
            this.selectedMenu = "Pokemon";
            this.menuPointer.x -= 200;
          }
        } else if (this.currentMenu == "Fight") {
          if (this.selectedMenu == "Move 3") {
            this.selectedMenu = "Move 1";
            this.menuPointer.x -= 300;
            this.pp_count_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][0][1] + "/15"
            );
            this.pp_type_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][0][2]
            );
          } else if (this.selectedMenu == "Move 4") {
            this.selectedMenu = "Move 2";
            this.menuPointer.x -= 300;
            this.pp_count_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][1][1] + "/15"
            );
            this.pp_type_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][1][2]
            );
          }
        }
        this.isLeftPress = false;
      } else if (
        Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
        this.isRightPress
      ) {
        if (this.currentMenu == "Menu") {
          if (this.selectedMenu == "Fight") {
            this.selectedMenu = "Mochila";
            this.menuPointer.x += 200;
          } else if (this.selectedMenu == "Pokemon") {
            this.selectedMenu = "Run";
            this.menuPointer.x += 200;
          }
        } else if (this.currentMenu == "Fight") {
          if (this.selectedMenu == "Move 1") {
            this.selectedMenu = "Move 3";
            this.menuPointer.x += 300;
            this.pp_count_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][2][1] + "/15"
            );
            this.pp_type_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][2][2]
            );
          } else if (this.selectedMenu == "Move 2") {
            this.selectedMenu = "Move 4";
            this.menuPointer.x += 300;
            this.pp_count_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][3][1] + "/15"
            );
            this.pp_type_text.setText(
              this.pokemons[this.currentPokemonIndex]["moves"][3][2]
            );
          }
        }
        this.isRightPress = false;
      }
      // Press yes
      else if (Phaser.Input.Keyboard.JustDown(this.yesKey) || this.isYesPress) {
        switch (this.selectedMenu) {
          case "Fight":
            this.setMenu(false);
            this.setPPMenu(true);
            this.setPointer(true);
            this.menuPointer.x = 30;
            this.currentMenu = "Fight";
            this.selectedMenu = "Move 1";
            this.isYesPress = false;
            break;
          case "Pokemon":
            this.game.scene.sleep("escenaCombate");
            this.game.scene.run("escenaPokemon", this);
            this.isYesPress = false;
            break;
          case "Mochila":
            this.game.scene.sleep("escenaCombate");
            this.game.scene.run("escenaMochila", this);
            this.isYesPress = false;
            break;
          case "Move 1":
            this.isAttacking = true;
            this.attack(0);
            this.isYesPress = false;
            break;
          case "Move 2":
            this.isAttacking = true;
            this.attack(1);
            this.isYesPress = false;
            break;
          case "Move 3":
            this.isAttacking = true;
            this.attack(2);
            this.isYesPress = false;
            break;
          case "Move 4":
            this.isAttacking = true;
            this.attack(3);
            this.isYesPress = false;
            break;
        }
      }
      // Press no
      else if (Phaser.Input.Keyboard.JustDown(this.noKey) || this.isNoPress) {
        switch (this.currentMenu) {
          case "Fight":
            this.setPPMenu(false);
            this.setMenu(true);
            this.isNoPress = false;
            break;
        }
      }
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  siguientePokemonRival() {
    // Determine which wild pokemon
    var d = Math.random();
    var cumulative =
      d *
      this.pokemon_rarity_cumulative[this.pokemon_rarity_cumulative.length - 1];
    this.wild_pokemon_index;
    for (let i = 0; i < 151; i++) {
      if (this.pokemon_rarity_cumulative[i] >= cumulative) {
        this.wild_pokemon_index = i;
        break;
      }
    }
    this.typing.start(
      "El rival saca a " +
        this.pokedexData[this.wild_pokemon_index]["name"]["english"] +
        "!"
    );

    // Choose 4 moves for this wild Pokemon
    this.opponent_pokemon_types =
      this.pokedexData[this.wild_pokemon_index]["type"];
    this.opponent_pokemon_moves = [];
    this.opponent_pokemon_num_types = this.opponent_pokemon_types.length;
    for (var i = 0; i < 4; i++) {
      do {
        var move_type_index = this.getRandomInt(
          0,
          this.opponent_pokemon_num_types - 1
        );
        var type = this.opponent_pokemon_types[move_type_index];
        if (!(type in this.typeMoves)) {
          continue;
        }
        var num_moves = this.typeMoves[type].length;
        var move_index = this.getRandomInt(0, num_moves - 1);
        var move = this.typeMoves[type][move_index];
        this.opponent_pokemon_moves.push([move["ename"], move["pp"]]);
      } while (!(type in this.typeMoves));
    }

    // Wild Pokemon
    this.opponentPokemon = {
      pokemon: this.pokedexData[this.wild_pokemon_index]["name"]["english"],
      moves: this.opponent_pokemon_moves,
      hp: 100,
      maxHp: 100,
      pokedex: this.wild_pokemon_index + 1,
    };
    // Destroy existing own Pokemon sprite
    if (this.opponent_pokemon_sprite != null) {
      this.opponent_pokemon_sprite.destroy();
      //this.opponent_pokemon_sprite = this.add.image(630, 350, 'pokemon' + (this.wild_pokemon_index + 1).toString()).setScale(3.0);
    }

    this.opponent_pokemon_hp_bar.displayWidth =
      (this.opponentPokemon["hp"] / this.opponentPokemon["maxHp"]) * 168;
    this.opponent_pokemon_name_text
      .setText(this.opponentPokemon["pokemon"], { color: "#000000" })
      .setFontSize("25px");

    // #endregion
    // #endregion
  }
}
export default escenaCombate;
