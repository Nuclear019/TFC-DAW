class escenaTorre extends Phaser.Scene {
  constructor() {
    super({ key: "escenaTorre" });
  }

  preload() {
    this.load.audio("battleTower", ["./assets/audio/battleTower.mp3"]);

  }
  create(data) {
    //Creamos variables que serán pasadas a la escena del combate
    this.pokedexData = data.pokedexData;
		this.pokemon_rarity_cumulative = data.pokemon_rarity_cumulative;
		this.pokemons = data.pokemons;
		this.moves = data.moves;
		this.numMoves = data.numMoves;
		this.tempMoves = data.tempMoves;
		this.typeMoves = data.typeMoves;
    this.victoria=data.victoria;
    this.puntos=data.puntos;

    this.add.image(450, 450, "torre").setScale(3);
    this.add.image(450, 400, "enemy").setScale(1.8);
		this.music = this.sound.add("battleTower");
		this.sound.pauseOnBlur = true;  
		if (this.music.isPlaying == false) {
		  this.music.play();
		  this.music.setVolume(0.04);
		}
    this.physics.add.sprite(450, 575, "player", 12).setScale(0.9);

    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0xdc5436, 1);
    this.graphics.fillRoundedRect(120, 700, 660, 145, 20);
    this.graphics.fillStyle(0x629ba0, 1);
    this.graphics.fillRoundedRect(125, 705, 650, 135, 20);

    this.typing = this.iniciarTextoEscrito();
    if (this.numeroRonda==0) {
      
    
    this.typing.start(
      'Bienvenido al desafio Torre Batalla!'+
      '\nAqui te enfrentaras a los mejores'+
      '\nentrenadores de Jhoto!'
    );
    this.typing.on("complete", () => {
      setTimeout(() => {
        this.typing.start(
          'Deberás intentar conseguir el mayor'+
          "\nnúmero de puntos si quieres ser uno"+
          "\nde ellos.");
        this.typing.on("complete", () => {
          setTimeout(() => {
            this.typing.start(
              'Que como consigues los puntos?'+
              '\nPues ganando combates y pasando de rondas.'+
              '\nCuantas mas rondas ganes mas '+
              '\npuntos obtendras.');
              this.typing.on("complete",()=>{      
                setTimeout(() => {
                  this.typing.start('Yo seré tu primer rival!'+
                  '\nAsi que sin mas dilación...')
                  this.typing.on("complete",()=>{   
                    setTimeout(() => {
                      this.typing.start("");
                      this.add.text(140, 750, "QUE EMPIEZE EL DESAFIO!!").setFontSize("43px");                 
                          setTimeout(() => {
                            this.inicioCombate();
                          }, 2000);
                        
                    }, 1500);
                  })
                  
                }, 1500);
                
              })
          }, 1500);
          
        });
      }, 1500);
     
    });
  }
  else{
    this.typing.start("De esta ronda no pasaras!!");
    this.typing.on("complete",()=>{
      setTimeout(() => {
        this.inicioCombate();
      }, 2000);
    })
  }
  }
  inicioCombate() {
    console.log(this.numeroRonda);
    this.music.stop();
    this.scene.stop("escenaTorre");
    this.scene.run("escenaCombate", this);

  }

  iniciarTextoEscrito() {
    this.isTyping = true;
    this.bottom_text = this.add.text(140, 720, "").setFontSize("25px");
    return this.plugins
      .get("rexTextTyping")
      .add(this.bottom_text, { speed: 50 });
  }
  update() {}

}
export default escenaTorre;
