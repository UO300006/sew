class Memoria {
    constructor() {

        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;
        this.aciertos = 0;

        this._parent = document.querySelector('main') || document.body;
        this._cards = Array.from(this._parent.querySelectorAll('article'));

        if (typeof Cronometro !== 'undefined') {
            this.cronometro = new Cronometro();
            this.cronometro.arrancar(); // Arranca automáticamente al iniciar el juego
        }


        // Inicializar juego
        this.barajarCartas();
        this.tablero_bloqueado = false;

        // Añadir listeners
        this._cards.forEach(card =>
            card.addEventListener('click', this.voltearCarta.bind(this))
        );
    }

    // Barajar cartas
    barajarCartas() {
        const cards = this._cards.slice();
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        cards.forEach(card => this._parent.appendChild(card));
        this._cards = Array.from(this._parent.querySelectorAll('article'));
    }

    // Reiniciar referencias y desbloquear tablero
    reiniciarAtributos() {
        this.tablero_bloqueado = false;
        this.primera_carta = null;
        this.segunda_carta = null;
    }

    // Voltear carta
    voltearCarta(event) {
        const card = event.currentTarget;
        if (this.tablero_bloqueado) return;
        if (!card) return;
        if (card.dataset.estado === 'volteada' || card.dataset.estado === 'revelada') return;
        if (this.primera_carta === card) return;

        // Voltear
        card.dataset.estado = 'volteada';

        if (!this.primera_carta) {
            this.primera_carta = card;
            return;
        }

        // Segunda carta
        this.segunda_carta = card;
        this.tablero_bloqueado = true;

        // Pequeño retraso para asegurar renderizado
        setTimeout(() => this.comprobarPareja(), 50);
    }

    // Comprobar si las dos cartas son pareja
    comprobarPareja() {
        if (!this.primera_carta || !this.segunda_carta) return;

        const img1 = this.primera_carta.querySelector('img');
        const img2 = this.segunda_carta.querySelector('img');
        const llave1 = img1 ? img1.src : this.primera_carta.textContent.trim();
        const llave2 = img2 ? img2.src : this.segunda_carta.textContent.trim();

        if (llave1 === llave2) {
            // Pareja correcta: permanecer descubiertas
            this.primera_carta.dataset.estado = 'revelada';
            this.segunda_carta.dataset.estado = 'revelada';
            this.aciertos += 1;

            this.reiniciarAtributos();
            this.comprobarJuego();
        } else {
            // Pareja incorrecta: cubrir después de 1.5 s
            setTimeout(() => {
                this.primera_carta.dataset.estado = 'normal';
                this.segunda_carta.dataset.estado = 'normal';
                this.reiniciarAtributos();
            }, 1500);
        }
    }

    // Comprobar si se terminó el juego
    comprobarJuego() {
        const resto = this._cards.filter(c => c.dataset.estado !== 'revelada');
        if (resto.length === 0) {
            if (this.cronometro && typeof this.cronometro.parar === 'function') {
                this.cronometro.parar();
            }
            setTimeout(() => alert(`¡Juego completado! Aciertos: ${this.aciertos}`), 200);
        } else {
            this.tablero_bloqueado = false;
        }
    }
}

// Instancia automática
document.addEventListener('DOMContentLoaded', () => {
    window.juegoMemoria = new Memoria();
});
