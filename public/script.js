const boton = document.getElementById("boton");



const buscar = boton.addEventListener("click", () => {
  const input = document.getElementById("searchPokemon");
  const nombreBuscar = input.value;
  var corpo = document.querySelector("#container");

  const searchPokemon = nombreBuscar.toLowerCase();
  const urlPokedex = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1010";

  async function pokedexFetch() {
    let locationsUrl = await fetch(urlPokedex);
    let pokemon = await locationsUrl.json();

    if (corpo !== null) {
      corpo=clearBody();
      
      const h1 = document.getElementById("buscador");
      h1.after(corpo);
      const foto = document.createElement("div");
      foto.setAttribute("class", "divImagen");
      const divPresentar = document.createElement("div")
      
      divPresentar.setAttribute("id","idPresentar")
      divPresentar.setAttribute("class","text-center card bg-success ")
      corpo.insertAdjacentElement("afterbegin", divPresentar);
      divPresentar.insertAdjacentElement("afterbegin", foto);

      for (const poke of pokemon["results"]) {
        if (poke.name == searchPokemon) {
          
          const pokeUrl = poke.url;
          pokemonFetch(pokeUrl);
        }
      }
    }
  }
  pokedexFetch();
});
async function pokemonFetch(pokeUrl) {
  let pokemonUrl = await fetch(pokeUrl);
  let pokemon = await pokemonUrl.json();
  const nome = document.createElement("h3");
  nome.textContent = pokemon["name"].toUpperCase();
  console.log(pokemon);

  const foto = document.querySelector(".divImagen");
  const divHabilidades = document.getElementById("idHabilidades");






  const estadisticas = document.getElementById("stats");
  const input = document.createElement("input");
  input.setAttribute("id", "myInput");

  const divAtaques = document.createElement("div")
  const tablaAtaques = document.createElement("table");
  const tbody = document.createElement("tbody");
   
  const thead = document.createElement("thead");
  tablaAtaques.insertAdjacentElement("afterbegin", thead);
  tbody.setAttribute("id", "myTable");

  tablaAtaques.setAttribute("class", "text-center");
  divAtaques.setAttribute("class", "scrollMoves divAtaques card");

  const cabecera = document.createElement("tr");
  estadisticas.after(divAtaques);
  divAtaques.insertAdjacentElement("afterbegin",tablaAtaques);

  divAtaques.insertAdjacentElement("afterbegin",input);
  thead.insertAdjacentElement("afterbegin", cabecera);
  const ataqueH = document.createElement("th");
  ataqueH.textContent = "Movimiento";
  cabecera.insertAdjacentElement("afterbegin", ataqueH);
  const poderH = document.createElement("th");
  poderH.textContent = "Poder";
  ataqueH.after(poderH);
  const precisionH = document.createElement("th");
  precisionH.textContent = "Precisión";
  poderH.after(precisionH);
  const tipoH = document.createElement("th");
  precisionH.after(tipoH);
  tipoH.textContent = "Tipo";



   //sprites
   const sprites = pokemon["sprites"];
   console.log();
   
   const finalSprites = sprites.versions["generation-v"]["black-white"].animated.front_default;
   const img = document.createElement("img");
   img.setAttribute("class", "sprite");
   if (finalSprites == null) {
     const h3 = document.createElement("h3");
     h3.textContent = "Non se atopou imáxen para este pokémon";
     foto.insertAdjacentElement("afterbegin", h3);
   } else {
    
     img.setAttribute("src", finalSprites);
     foto.insertAdjacentElement("afterbegin", img);
     img.after(nome)
     foto.after(divHabilidades)
     divHabilidades.after(estadisticas)
   }

  //Filtro ataques

  for (const moves of pokemon.moves) {
    async function movesFetch() {
      let ataquesUrl = await fetch(moves.move.url);
      let attack = await ataquesUrl.json();
      const filaAtaque = document.createElement("tr");
      thead.after(tbody);
      tbody.insertAdjacentElement("afterbegin", filaAtaque);
      for (const names of attack.names) {
        if (names.language.name == "es") {
          const ataques = document.createElement("td");
          const poder = document.createElement("td");
          const precision = document.createElement("td");
          const tipoAtaque = document.createElement("td");

          function filtroAtaques() {
            // Declare variables
            var input, filter, table, tr, td, i, j, visible;
            input = document.getElementById("myInput");
            filter = input.value.toUpperCase();
            table = document.getElementById("myTable");
            tr = table.getElementsByTagName("tr");

            // Loop through all table rows, and hide those who don't match the search query
            for (i = 0; i < tr.length; i++) {
              visible = false;
              /* Obtenemos todas las celdas de la fila, no sólo la primera */
              td = tr[i].getElementsByTagName("td");
              for (j = 0; j < td.length; j++) {
                if (
                  td[j] &&
                  td[j].innerHTML.toUpperCase().indexOf(filter) > -1
                ) {
                  visible = true;
                }
              }
              if (visible === true) {
                tr[i].style.display = "";
              } else {
                tr[i].style.display = "none";
              }
            }
          }
          input.setAttribute("style","margin:5px;")
          input.addEventListener("keyup", filtroAtaques);

          ataques.textContent = names.name;
          if (attack.power == null) {
            poder.textContent = "-";
          } else {
            poder.textContent = attack.power;
          }

          if (attack.accuracy == null) {
            precision.textContent = "-";
          } else {
            precision.textContent = attack.accuracy;
          }

          const typePokemonMove = attack.type.name.split("");

          for (
            let index = 0;
            index < typePokemonMove.length;
            index++
          ) {
            if (index == 0) {
              typePokemonMove[0] = typePokemonMove[0].toUpperCase();
            }
          }
          const nomeTipo = typePokemonMove.join("");

          const urlTipos = `http://play.pokemonshowdown.com/sprites/types/${nomeTipo}.png`;
          const tipoImg = document.createElement("img");
          tipoImg.setAttribute("src", urlTipos);
          tipoImg.setAttribute("class", "img");
          tipoImg.setAttribute("alt", attack.type.name);

          tipoAtaque.insertAdjacentElement("beforeend", tipoImg);

          filaAtaque.insertAdjacentElement("afterbegin", ataques);
          ataques.after(poder);
          poder.after(precision);
          precision.after(tipoAtaque);
        }
      }
    }
    movesFetch();
  }
  //habilidades

  const titulo = document.querySelector("th");
  titulo.textContent = "Habilidades";
  const row1 = document.getElementById("1");

  for (const abilities of pokemon["abilities"]) {
    async function habilidadesFetch() {
      let paginaHabilidades = await fetch(abilities.ability.url);
      let habilidadesDatos = await paginaHabilidades.json();

      const newRow = document.createElement("tr");
      const habilidad = document.createElement("a");
      const descHabilidade = document.createElement("td");
      for (const nombre of habilidadesDatos.names) {
        if (nombre.language.name == "es") {
          const nomeFinal = nombre.name;
          habilidad.textContent = nomeFinal;
          row1.after(newRow);
          newRow.insertAdjacentElement("afterbegin", habilidad);
        }
      }
      for (const iterator of habilidadesDatos.flavor_text_entries) {
        if (iterator.language.name == "es") {
          descHabilidade.textContent = iterator.flavor_text;
        }
        habilidad.after(descHabilidade);
      }
    }
    habilidadesFetch();
  }
  const tabla = document.getElementById("stats-tr");
  let total = 0;
  for (const iterator of pokemon["stats"]) {
    const stats = document.createElement("td");
    stats.textContent = iterator.base_stat;
    tabla.insertAdjacentElement("beforeend", stats);
    total = total + iterator.base_stat;
    const totalStats = document.getElementById("total");
  }
  const ultimaStat = tabla.lastElementChild;
  ultimaStat.after(total);
  //tipos
  const datos = document.createElement("div");

  datos.setAttribute("class", "datos");
  const tipos = document.createElement("div");
  tipos.setAttribute("class", "tipos");
  nome.after(datos);
  datos.after(tipos);

  //relacion de daño

  //peso e altura
  const peso = document.createElement("p");
  const weigth = `${pokemon.weight}`;
  let arrayPeso = weigth.split("");
  arrayPeso.splice(-1, 0, ",");
  const pesoFinal = arrayPeso.join("");
  peso.textContent = "Peso: " + pesoFinal + " Kg";
  tipos.after(peso);

  for (const iterator of pokemon["types"]) {
    const type = iterator.type.name;
    const typeArray = type.split("");

    for (let index = 0; index < typeArray.length; index++) {
      if (index == 0) {
        typeArray[0] = typeArray[0].toUpperCase();
      }
    }
    typeName = typeArray.join("");

    const urlTipos = `http://play.pokemonshowdown.com/sprites/types/${typeName}.png`;
    const tipoImg = document.createElement("img");
    tipoImg.setAttribute("src", urlTipos);

    tipos.insertAdjacentElement("beforeend", tipoImg);
  }          
}
/** 
 * Moita liada da testa
 * 
 * 
 * 
 * const cadroDebilidades= document.createElement("table")
            cadroDebilidades.setAttribute("id","idDebilidades")
            cadroDebilidades.setAttribute("class"," text-center")
            const tabHabilidades = document.getElementById("idHabilidades")
            tabHabilidades.before(cadroDebilidades)
            const cabRelacións = document.createElement("tr")
            cabRelacións.setAttribute("id","idCabeceraRelacions")
            const relacionDaño = ["Recibe 2X de ","Hace 0X a ","Recibe 0X de ","Hace 1/2X a ","Recibe 1/2X de ", "Hace 2X a "];
            const relacion1 = document.createElement("th");
            relacion1.textContent=relacionDaño[0]
            cadroDebilidades.insertAdjacentElement("beforeend",cabRelacións)

            cabRelacións.insertAdjacentElement("beforeend",relacion1)
            for (let index = 1; index < relacionDaño.length; index++) {
              const relacions = document.createElement("th");
            relacions.textContent=relacionDaño[index]
            relacion1.after(relacions)              
            }
            console.log(relacionDaño);
 * 
 * for (const types of pokemon.types) {
              const crearRow = document.createElement("tr")
              cabRelacións.after(crearRow)
              console.log(types.type.url);
              async function typesFetch() {
                let paginaTipos = await fetch(types.type.url);
                let infoTipo = await paginaTipos.json();
                const relacionDaño =infoTipo.damage_relations;
                for (const daño in relacionDaño) {
                  console.log(relacionDaño);

                  if (relacionDaño[daño].length==0) {
                    const tdRelacions = document.createElement("td");
                    tdRelacions.textContent="-"
                    crearRow.insertAdjacentElement("beforeend",tdRelacions);
                  }if(relacionDaño[daño].length<1) {
                    
                    for (const relacionConTipos of relacionDaño[daño]) {
                      console.log(relacionConTipos)
  
                      const tdRelacions = document.createElement("tr");
                      tdRelacions.textContent=relacionConTipos.name
                      crearRow.insertAdjacentElement("beforeend",tdRelacions);
                      
                    }
                  }else{

                    for (const relacionConTipos of relacionDaño[daño]) {
                      console.log(relacionConTipos)
  
                      const tdRelacions = document.createElement("td");
                      tdRelacions.textContent=relacionConTipos.name
                      crearRow.insertAdjacentElement("beforeend",tdRelacions);
                      
                    }
                 

                  }

                  
                  
                }
              }
              typesFetch();
            }*/
function clearBody() {
  var corpo = document.querySelector("#container");
      corpo = corpo.remove();
      corpo = document.createElement("div");
      corpo.setAttribute("class", "container ");
      corpo.setAttribute("id","container")

      corpo.innerHTML =
        '<table id="idHabilidades" class="text-center   table-bordered border justify-content-center ">' +
        '<tr id="1">' +
        '    <th name="nome"></th>' +
        "</tr>" +
        "</table>" +
        "<br />" +
        '<table class="table-bordered table-sm border" id="stats">' +
        "<tr>" +
        "<th>HP</th>" +
        "  <th>ATK</th>" +
        "<th>DEF</th>" +
        "<th>ATS</th>" +
        "<th>DFS</th>" +
        "<th>SPD</th>" +
        '<th id="total">TTL</th>' +
        "</tr>" +
        '<tr id="stats-tr">' +
        "  </tr>" +
        '</table>'
        ;
        return corpo;
}























