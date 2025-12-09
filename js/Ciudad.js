class Ciudad {
    // Constructor que inicializa nombre, país y gentilicio
    constructor(nombre, pais, gentilicio) {
      this.nombre = nombre;
      this.pais = pais;
      this.gentilicio = gentilicio;
      this.poblacion = null;
      this.coordenadas = null;
    }
  
    // Rellena la población y coordenadas
    rellenarDatos(poblacion, coordenadas) {
      this.poblacion = poblacion;
      this.coordenadas = coordenadas;
    }
  
    // Devuelve el nombre de la ciudad
    obtenerNombreCiudad() {
      return this.nombre;
    }
  
    // Devuelve el nombre del país
    obtenerNombrePais() {
      return this.pais;
    }
  
    // Devuelve una lista con gentilicio y población
    obtenerInformacionLista() {
      return `
        <ul>
          <li>Gentilicio: ${this.gentilicio}</li>
          <li>Población: ${this.poblacion.toLocaleString()} habitantes</li>
        </ul>
      `;
    }
  
    // Escribe las coordenadas en el documento HTML
    escribirCoordenadas() {
      if (this.coordenadas) {
        document.write(
          `<p>Latitud: ${this.coordenadas.latitud}, Longitud: ${this.coordenadas.longitud}</p>`
        );
      } else {
        document.write(`<p>Coordenadas no disponibles.</p>`);
      }
    }
  }
  