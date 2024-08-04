import escenaCombate from "./src/escenaCombate.js";
import escenaTorre from "./src/escenaTorre.js";
import mainScene from "./src/mainScene.js";
import escenaMochila from "./src/escenaMochila.js";
import escenaPokemon from "./src/escenaPokemon.js";
import escenaInfoPokemon from "./src/escenaInfoPokemon.js";
import escenaTarjeta from "./src/escenaTarjeta.js";

import TextTypingPlugin from './src/plugins/texttyping-plugin.js';

var config = {
  type: Phaser.AUTO,
  parent: "gamepad",
  width: 900,
  height: 900,
  physics: {
    default: "arcade",
    arcade: {
    },
  },
  scene: [mainScene,escenaMochila,escenaTorre,escenaCombate,escenaPokemon,escenaInfoPokemon,escenaTarjeta ],
  plugins: {
    global: [{
        key: 'rexTextTyping',
        plugin: TextTypingPlugin,
        start: true
    }]
},
};
const game = new Phaser.Game(config);
