class Persona {
    constructor(id, nombre, apellido, edad) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    getToString() {
        return `${this.id} - ${this.nombre} ${this.apellido} ${this.edad}`;
    }

    getToJson() {
        return JSON.stringify({
        id: this.id,
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        });
    }
}

export default Persona;