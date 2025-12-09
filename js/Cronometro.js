class Cronometro {
    constructor() {
        this.tiempo = 0; // Tiempo en milisegundos
        this.inicio = null;
        this.corriendo = null;
    }

    arrancar() {
        if (this.corriendo == null) {
            try {
                this.inicio = Temporal.Now.instant();
            } catch (e) {
                this.inicio = new Date();
            }
            this.corriendo = setInterval(this.actualizar.bind(this), 100); //Con el bind el this hace refencia al cronometro, sino seria a la ventana
        }
    }

    actualizar() {
        let ahora;
        try {
            ahora = Temporal.Now.instant();
            this.tiempo = ahora.since(this.inicio).total('milliseconds');
        } catch (e) {
            ahora = new Date();
            this.tiempo = ahora - this.inicio;
        }
        this.mostrar();
    }

    mostrar() {
        const minutos = String(Math.floor(this.tiempo / 60000)).padStart(2, '0');
        const segundos = String(Math.floor((this.tiempo % 60000) / 1000)).padStart(2, '0');
        const decimas = String(Math.floor((this.tiempo % 1000) / 100));
        const elem = document.getElementById('cronometro');
        if (elem) {
            elem.textContent = `${minutos}:${segundos}.${decimas}`;
        }
    }

    parar() {
        clearInterval(this.corriendo);3
        this.corriendo = null;
    }

    reiniciar() {
        this.parar();
        this.tiempo = 0;
        this.mostrar();
    }
}