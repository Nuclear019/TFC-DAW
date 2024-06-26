class escenaInfoPokemon extends Phaser.Scene {
    constructor() {
      super({ key: "escenaInfoPokemon" });
    }
  
    preload() {}
    create(data) {
      if ("isBattleScene" in data) {
        this.isBattleScene = true;
      }
      //Creamos variables que serán pasadas a la escena del combate
      this.pokedexData = data.pokedexData;
      this.pokemon_rarity_cumulative = data.pokemon_rarity_cumulative;
      this.pokemons = data.pokemons;
      this.moves = data.moves;
      this.numMoves = data.numMoves;
      this.tempMoves = data.tempMoves;
      this.typeMoves = data.typeMoves;
      this.numeroRonda=data.numeroRonda;
      this.puntos=data.puntos;
      this.selectedMenu=data.selectedMenu;
      this.click = data.click;

      this.json_types={
        Normal:0,
        Fight:1,
        Flying:2,
        Poison:3,
        Ground:4,
        Rock:5,
        Bug:6,
        Ghost:7,
        Steel:8,
        Fairy:9,
        Fire:10,
        Water:11,
        Grass:12,
        Electric:13,
        Psychic:14,
        Ice:15,
        Dragon:16,
        Dark:17
      }
      this.yesKey = this.input.keyboard.addKey('A');
      this.noKey = this.input.keyboard.addKey('B');
      this.salir="Salir";
      this.id_pokemon_seleccionado = parseInt(this.selectedMenu);
      this.pokemon_types=this.pokemons[this.id_pokemon_seleccionado]["type"];
      this.pokemon_moves=this.pokemons[this.id_pokemon_seleccionado]["moves"];
      console.log(this.pokemon_moves);
      this.add.image(450, 450, "pokemon_info").setScale(3.75);
      this.add.image(450, 450, ).setScale(3.75);
      this.ownPokemon = this.add.image(150, 350, 'pokemon' + this.pokemons[this.id_pokemon_seleccionado]["pokedex"].toString()).setScale(3);
      
      this.selected_cancel = this.add.image(150, 670, 'selected-cancel');
      this.selected_cancel.setScale(3.8);
      this.cancelText = this.add.text(105, 655, 'Salir').setFontSize('30px');

      //Imagenes de los tipos del pokémon
      for (const type in this.json_types) {
        for (let index = 0; index < this.pokemon_types.length; index++) {
            if (this.pokemon_types[index]==type.toString()) {
                if (this.pokemon_types.length==1) {
                    this.add.sprite(150, 450, "types",this.json_types[type]).setScale(2.3);
                }
                else{
                    this.add.sprite(100 +(index*100), 450, "types",this.json_types[type]).setScale(2.3);
                }
            }            
        }
      }


    //Información de los ataques del pokemon

          //Textos
    this.move_1 = this.add.text(500, 250, this.pokemon_moves[0][0], { color: '#000000' }).setFontSize('25px');
		this.move_2 = this.add.text(500, 320,  this.pokemon_moves[1][0], { color: '#000000' }).setFontSize('25px');
		this.move_3 = this.add.text(500, 390,  this.pokemon_moves[2][0], { color: '#000000' }).setFontSize('25px');
		this.move_4 = this.add.text(500, 460,  this.pokemon_moves[3][0], { color: '#000000' }).setFontSize('25px');
    console.log(this.isBattleScene)
        //Imagenes de los tipos de los moviminetos
        for (const type in this.json_types) {
          for (let index = 0; index < this.pokemon_moves.length; index++) {
              if (this.pokemon_moves[index][2]==type.toString()) {
                  
                      this.add.sprite(380 , 260+(index*70), "types",this.json_types[type]).setScale(2.3);
                  
              }            
          }
        }

        //PP
        
          for (let index = 0; index < this.pokemon_moves.length; index++) {
                  
                this.add.text(740, 260 + (index*70), "PP  "+ this.pokemon_moves[index][1]+"/"+this.pokemon_moves[index][1], { color: '#000000' }).setFontSize('25px');
                  
                          
          }
        

    }

  
    iniciarTextoEscrito() {
      this.isTyping = true;
      this.bottom_text = this.add.text(160, 710, "").setFontSize("25px");
      return this.plugins
        .get("rexTextTyping")
        .add(this.bottom_text, { speed: 50 });
    }
    update() {

      if (Phaser.Input.Keyboard.JustDown(this.yesKey) || this.isYesPress) {
        this.click.play();
          switch (this.salir) {
            case "Salir":
              this.game.scene.stop("escenaInfoPokemon");
              this.game.scene.run("escenaPokemon", this);
            break;
          }
        } 
    }
    }

  export default escenaInfoPokemon;