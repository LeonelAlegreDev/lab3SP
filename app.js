import HomeController from "./src/controllers/HomeController.js";
import Loader from "./src/utils/Loader.js";

let personas = [];

// Muestra la pantalla de carga
document.documentElement.addEventListener("load", function(){
    Loader.Show();
});

// Obtiene las personas
HomeController.GetPersonasXML(function(resultado) {
    // Aquí puedes trabajar con el resultado de la solicitud
    let json = JSON.parse(resultado);
    personas = HomeController.ParsearDatos(json);

    // Carga la tabla con los datos
    HomeController.CargarTablaPersonas(personas);

    // Activa manejadores para los eventos del form ABM
    HomeController.HandleABM(personas);

    // Oculta la pantalla de carga
    Loader.Hide();
});
