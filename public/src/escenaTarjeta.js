class escenaTarjeta extends Phaser.Scene {
    constructor() {
      super({ key: "escenaTarjeta" });
    }
  
    preload() {}
    create(data) {
        this.click=data.click;
        this.pokemons = data.pokemons;
        this.numPokemon = this.pokemons.length;
        this.game = data.game;

		this.add.image(450, 450, "card_background").setScale(4);
		this.add.image(450, 380, "card").setScale(2.5);
		this.add.image(255, 340, "trainer_profile").setScale(1.7);
    this.add.text(210, 220, "Tarjeta de entrenador", { color: '#ffffff', align: 'center' }).setFontSize('30px');


      this.add.image(410, 290, "pokemon" + this.pokemons[0].pokedex);
      this.add.text(485, 285, this.pokemons[0].pokemon, { color: '#ffffff', align: 'center' }).setFontSize('20px');
    
      this.add.image(490, 350, "pokemon" + this.pokemons[1].pokedex);
      this.add.text(570, 340, this.pokemons[1].pokemon, { color: '#ffffff', align: 'center' }).setFontSize('20px');

      this.add.image(405, 390, "pokemon" + this.pokemons[2].pokedex);
      this.add.text(485, 385, this.pokemons[2].pokemon, { color: '#ffffff', align: 'center' }).setFontSize('20px');


      this.add.text(210, 440, "Nombre de entrenador: " + datos[0], { color: '#ffffff', align: 'center' }).setFontSize('20px');
      this.add.text(210, 480, "Record de victorias: "+datos[2], { color: '#ffffff', align: 'center' }).setFontSize('20px');
      this.add.text(210, 520, "Cuenta creada el: " +datos[1], { color: '#ffffff', align: 'center' }).setFontSize('20px');






      this.yesKey = this.input.keyboard.addKey('A');
      this.noKey = this.input.keyboard.addKey('B');
      this.salir="Salir";
 
    
      this.selected_cancel = this.add.image(730, 720, 'selected-cancel');
      this.selected_cancel.setScale(3.8);
      this.cancelText = this.add.text(690, 705, 'Salir').setFontSize('30px');


        
    }

    update() {

      if (Phaser.Input.Keyboard.JustDown(this.yesKey) || this.isYesPress) {
        this.click.play();
          switch (this.salir) {
            case "Salir":
              this.game.scene.stop("escenaTarjeta");
              this.game.scene.run("mainScene");
            break;
          }
        } 
    }
}

    

  export default escenaTarjeta;