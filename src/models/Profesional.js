import  Persona  from "./Persona.js";

class Profesional extends Persona {
    constructor(id, nombre, apellido, edad, titulo, facultad, anioGraduacion)
    {
        super(id, nombre, apellido, edad);
        this.titulo = titulo;
        this.facultad = facultad;
        this.anioGraduacion = anioGraduacion;
    }

    getToString() {
        return `${super.getToString()} - ${this.titulo} - ${this.facultad} - ${this.anioGaduacion}`;
    }
}

export default Profesional;
