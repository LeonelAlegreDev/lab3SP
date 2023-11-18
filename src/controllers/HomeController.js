import Futbolista from "../models/Futbolista.js";
import Profesional from "../models/Profesional.js";

class HomeController
{
    static async GetPersonas(){
        const response = await fetch('http://localhost/Lab3-SP/personasFutbolitasProfesionales.php', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });
        const json = await response.json();
        let result = this.ParsearDatos(json);
        return result;
    }

    static GetPersonasXML(callback){
        var xhttp = new XMLHttpRequest(); //Instancio el objeto
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //Acción a ejecutar cuando el estado es 200 ok y el readyState=4 (respuesta lista)
                const res = xhttp.response;
                callback(res);            
            }
        }; //Configúro manejador para cambio de estado
        xhttp.open("GET", "http://localhost/Lab3-SP/personasFutbolitasProfesionales.php", true); //Inicializo la solicitud
        xhttp.send(); //Envio la solicitud
    }

    // Parsea un array json a Personas
    static ParsearDatos(datos) {
        const personas = datos.map((persona) => {
            const esFutbolista = persona.equipo && persona.posicion && persona.cantidadGoles >= 0;
            const esProfesional = persona.titulo && persona.facultad && persona.añoGraduacion;

            if (esFutbolista) {
                return new Futbolista(
                    persona.id,
                    persona.nombre,
                    persona.apellido,
                    persona.edad,
                    persona.equipo,
                    persona.posicion,
                    persona.cantidadGoles
                );
            }
            else if(esProfesional){
                return new Profesional(
                    persona.id,
                    persona.nombre,
                    persona.apellido,
                    persona.edad,
                    persona.titulo,
                    persona.facultad,
                    persona.añoGraduacion
                );
            }
        });
        return personas;
    }

    static CargarTablaPersonas(personas){
        const tablaPersonas = document.getElementById('table_lista');
        const tbody = tablaPersonas.querySelector("tbody");
        let registros = [];
        let registro;

        tbody.innerHTML = "";

        personas.forEach(persona => {
            switch (persona.constructor.name) {
                case 'Futbolista':
                    registro = {
                        id: persona.id,
                        nombre: persona.nombre,
                        apellido: persona.apellido,
                        edad: persona.edad,
                        equipo: persona.equipo,
                        posicion: persona.posicion,
                        cantidadGoles: persona.cantidadGoles,
                        titulo: "N/A",
                        facultad: "N/A",
                        anioGraduacion: "N/A"
                    }
                    registros.push(registro);
                    break;

                case 'Profesional':
                    registro = {
                        id: persona.id,
                        nombre: persona.nombre,
                        apellido: persona.apellido,
                        edad: persona.edad,
                        equipo: "N/A",
                        posicion: "N/A",
                        cantidadGoles: "N/A",
                        titulo: persona.titulo,
                        facultad: persona.facultad,
                        anioGraduacion: persona.anioGraduacion
                    }
                    registros.push(registro);
                    break;
            }
        });

        registros.forEach(element => {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);

            for (var propiedad in element) {
                if (element.hasOwnProperty(propiedad)) {
                    let td = document.createElement("td");
                    tr.appendChild(td);
                    tr.setAttribute("data-id", element.id);

                    td.appendChild(document.createTextNode(element[propiedad]));
                    td.setAttribute(propiedad, element[propiedad]);
                }
            }
            let td_modificar = document.createElement("td");
            tr.appendChild(td_modificar);

            let button_modificar = document.createElement("button");
            td_modificar.appendChild(button_modificar);

            button_modificar.appendChild(document.createTextNode("Modificar"))
            button_modificar.setAttribute("id", "table_modificar");
            button_modificar.classList.add('btn');
            button_modificar.classList.add('btn-secondary');

            let td_eliminar = document.createElement("td");
            tr.appendChild(td_eliminar);

            let button_eliminar = document.createElement("button");
            td_eliminar.appendChild(button_eliminar);

            button_eliminar.appendChild(document.createTextNode("Eliminar"))
            button_eliminar.setAttribute("id", "table_modificar");
            button_eliminar.classList.add('btn');
            button_eliminar.classList.add('btn-danger');
        });
    }

    static HandleABM(personas) {
        // Muestra el formulario ABM
        document.getElementById("btn_agregar_persona").addEventListener("click", () =>{
            document.getElementById("abm_container").style.display = "flex";
            document.getElementById("form_container").style.display = "none";
        });

        // Oculta el formulario ABM al cancelar
        document.getElementById("abm_cancelar").addEventListener("click", () =>{
            document.getElementById("abm_container").style.display = "none";
            document.getElementById("form_container").style.display = "flex";;

            const requireFields = document.getElementById('form_abm').querySelectorAll('[required]');
            for (const campo of requireFields) {
                // Oculta el mensaje de error
                campo.nextElementSibling.classList.add("hidden");
            }
        });

        // Confirmacion del Alta ABM
        document.getElementById("abm_confirmar").addEventListener("click", (event) =>{
            const form = document.getElementById('form_abm');
            const campos_comunes = [
                document.getElementById('abm_nombre'),
                document.getElementById('abm_apellido'),
                document.getElementById('abm_edad'),
            ];
            const campos_futbolista = [
                document.getElementById('abm_equipo'),
                document.getElementById('abm_cantGoles'),
                document.getElementById('abm_posicion'),
            ];
            const campos_profesional = [
                document.getElementById('abm_titulo'),
                document.getElementById('abm_añoGraduacion'),
                document.getElementById('abm_facutad'),
            ];

            // Verificar si todos los campos con require están completados
            let todosCompletados = true;

            for (const campo of campos_comunes) {
                if (campo.value === null || campo.value === '' || campo.value === undefined) {
                    todosCompletados = false;

                    // Muestra mensaje de error
                    campo.nextElementSibling.classList.remove("hidden");
                }
                else{
                    // Oculta el mensaje de error
                    campo.nextElementSibling.classList.add("hidden");
                }
            }
            switch (document.getElementById("abm_tipo").value) {
                case "futbolista":
                    for (const campo of campos_futbolista) {
                        if (campo.value === null || campo.value === '' || campo.value === undefined) {
                            todosCompletados = false;
                            // Muestra mensaje de error
                            campo.nextElementSibling.classList.remove("hidden");
                        }
                        else{
                            // Oculta el mensaje de error
                            campo.nextElementSibling.classList.add("hidden");
                        }
                    }
                    break;

                case "profesional":
                    for (const campo of campos_profesionales) {
                        if (campo.value === null || campo.value === '' || campo.value === undefined) {
                            todosCompletados = false;

                            // Muestra mensaje de error
                            campo.nextElementSibling.classList.remove("hidden");
                        }
                        else{
                            // Oculta el mensaje de error
                            campo.nextElementSibling.classList.add("hidden");
                        }
                    }
                    break;
            }


            // Valida que se hayan marado los campos
            if (todosCompletados === true) {
                console.loh("alta abm")
            }
            else{
                event.preventDefault();
            }
        });

        // Muestra y oculta campos del formulario segun el tipo
        document.getElementById("abm_tipo").addEventListener("input", () =>{

            // Obtiene los campos a manipular
            const equipo = document.getElementById("abm_equipo").parentNode;
            const posicion = document.getElementById("abm_posicion").parentNode;
            const cantGoles = document.getElementById("abm_cantGoles").parentNode;

            const titulo = document.getElementById("abm_titulo").parentNode;
            const añoGraduacion = document.getElementById("abm_añoGraduacion").parentNode;
            const facultad = document.getElementById("abm_facultad").parentNode;

            // Se guardan los campos en array segun su tipo
            const campos_futbolista = [equipo, posicion, cantGoles];
            const campos_profesional = [titulo, añoGraduacion, facultad];

            // Obtiene el valor actual y maneja los resultados
            switch (document.getElementById("abm_tipo").value)
            {
                case "futbolista":
                    // Muestra los campos de Empleado
                    campos_futbolista.forEach(campo => {
                        campo.classList.remove("hidden");
                    });

                    // Ocuta los campos de Cliente
                    campos_profesional.forEach(campo => {
                        campo.classList.add("hidden");
                    });
                    break;

                case "profesional":
                    // Muestra los campos de Cliente
                    campos_profesional.forEach(campo => {
                        campo.classList.remove("hidden");
                    });

                    // Ocuta los campos de Empleado
                    campos_futbolista.forEach(campo => {
                        campo.classList.add("hidden");
                    });
                    break;
                default:
                    break;
            }
        });
    }


}

export default HomeController;