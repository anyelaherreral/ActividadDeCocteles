document.addEventListener("DOMContentLoaded", () => {
  const listaIngredientes = document.getElementById("seleccion-ingrediente");
  const listaTipo = document.getElementById("seleccion-tipo");
  const nombre = document.getElementById("nombreCoctel");
  const formulario = document.getElementById("formularo-busqueda");
  const seccionResultado = document.getElementById("resultados");

  async function cargarIngredientes() {
    try {
      const response = await fetch(
        /*(await fetch siempre juntos)fetch https solicitudes a la web - interactuar con los datos de la api */
        "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list"
      );
      const data = await response.json();
      /*Hace que el programa espere hasta que la solicitud termine y se obtenga la respuesta del servidor asegura que no se ejecute el siguiente código hasta que la respuesta sea recibida. */
      /*response.json(): Convierte la respuesta de la API, que está en formato de texto (JSON), en un objeto JavaScript. */
      const ingredients = data.drinks;
      /*data.drinks: La API devuelve un objeto con un campo llamado drinks que contiene un arreglo de objetos. el drink es el nombre del arreglo */
      ingredients.forEach((ingredient) => {
        const option = document.createElement("option");
        option.value = ingredient.strIngredient1;
        option.textContent = ingredient.strIngredient1;
        listaIngredientes.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar ingredientes:", error);
      listaIngredientes.innerHTML =
        '<option value="">Error al cargar ingredientes</option>';
    }
  }

  async function cargarTipo() {
    try {
      const respuesta = await fetch(
        "https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list"
      );
      const data = await respuesta.json();
      const tipo = data.drinks;

      tipo.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.strAlcoholic;
        option.textContent = element.strAlcoholic;
        listaTipo.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar el tipo:", error);
      listaTipo.innerHTML = '<option value="">Error al cargar tipo</option>';
    }
  }

  async function buscarCoctel(num, valor) {
    let apiUrl = "";
    // Determinar la URL de búsqueda según el criterio
    if (num === 1) {
      // Buscar por ingrediente
      apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
        valor
      )}`;
    } else if (num === 2) {
      // Buscar por tipo
      apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
        valor
      )}`;
    } else if (num === 3) {
      // Buscar por nombre
      apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        valor
      )}`;
    }

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      mostrarResultados(data.drinks); // Mostrar los resultados obtenidos
    } catch (error) {
      console.error("Error al buscar el cóctel:", error);
      seccionResultado.innerHTML = "<h2>Error al buscar el cóctel</h2>";
    }
  }

  function mostrarResultados(cocteles) {
    seccionResultado.innerHTML= '<h1 id="titulo-resultados">Resultados</h1>';
    if (!cocteles) {
      seccionResultado.innerHTML +=
        "<p>No se encontraron cocteles con ese nombre.</p>";
      return;
    }

    cocteles.forEach((coctel) => {
      const divCoctel = document.createElement("div");
      divCoctel.classList.add("coctel");

      const nombre = document.createElement("h3");
      nombre.textContent = coctel.strDrink;

      const imagen = document.createElement("img");
      imagen.src = coctel.strDrinkThumb;
      imagen.alt = `Imagen de ${coctel.strDrink}`;

      divCoctel.appendChild(imagen);
      divCoctel.appendChild(nombre);
      seccionResultado.appendChild(divCoctel);
    });
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const ingredienteSeleccionado = listaIngredientes.value;
    const tipoSeleccionado = listaTipo.value;
    const nombreCoctel = nombre.value.trim();

    // Validar que solo un campo esté lleno
    const numeroCamposLlenos = [
      ingredienteSeleccionado,
      tipoSeleccionado,
      nombreCoctel,
    ].filter(
      (campo) => campo !== ""
    ).length; /*se obtienen los valores diferentes de vacio en los select y nombre (filter) y se cuenta el tamaño */

    if (numeroCamposLlenos > 1) {
      /**si hay mas de 1 genera alerta */
      alert(
        "Por favor, selecciona solo un criterio de búsqueda: ingrediente, tipo o nombre."
      );
      return;
    }

    if (ingredienteSeleccionado) {
      buscarCoctel(1, listaIngredientes.value);
    } else if (tipoSeleccionado) {
      buscarCoctel(2, listaTipo.value);
    } else if (nombreCoctel) {
      buscarCoctel(3, nombre.value);
    } else {
      seccionResultado.innerHTML =
        "<p>Por favor, selecciona un criterio de búsqueda.</p>";
    }
  });

  cargarIngredientes();
  cargarTipo();
});
