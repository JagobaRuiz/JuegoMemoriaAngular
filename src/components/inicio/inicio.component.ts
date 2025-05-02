import {Component, OnInit} from '@angular/core';
import {Carta} from '../../models/carta.model';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {CartaComponent} from '../carta/carta.component';
import {Historial} from '../../models/historial.model';

@Component({
  selector: 'app-inicio',
  imports: [
    NgIf,
    CartaComponent,
    NgForOf,
    DatePipe,
    NgClass
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  nivelesDificultad = {
    facil: 3,
    intermedio: 6,
    dificil: 12
  };

  dificultadElegida: string | null = null;
  cartas: Carta[] = [];
  palos = ['picas', 'corazones', 'diamantes', 'treboles'];
  valores = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
  hayPartidaEnJuego: boolean = false;

  cartasGiradas: Carta[] = [];
  estaComprobando = false;
  parejasHechas: number = 0;
  numParejas: number = 0;
  finPartida: boolean = false;
  cronometro: number = 0;
  idIntervalo: any;

  historial: Historial[] = [];

  ngOnInit(): void {
    const historialGuardado = localStorage.getItem('historial');
    if (historialGuardado) {
      this.historial = JSON.parse(historialGuardado) as Historial[];
    }
  }

  elegirDificultad(nivel: string) {
    this.dificultadElegida = nivel;
    this.cartas = this.generarCartas(this.nivelesDificultad[nivel as keyof typeof this.nivelesDificultad]); // Genera un número de cartas acorde a la dificultad elegida
    this.empezarJuego();
  }

  generarCartas = (numParejas: number): Carta[] => {
    this.numParejas = numParejas;
    const baraja: Carta[] = [];

    while (baraja.length < numParejas * 2) {
      const valor = this.valores[Math.floor(Math.random() * this.valores.length)];
      const palo = this.palos[Math.floor(Math.random() * this.palos.length)];
      const rutaImg = 'assets/cartas' + '/' + valor.toLowerCase() + '_' + palo.toLowerCase() + '.png';

      const carta: Carta = {valor, palo, imagen: rutaImg, estaGirada: false, estaEmparejada: false };

      if (!baraja.some(c => c.valor === carta.valor && c.palo === carta.palo)) {
        baraja.push({...carta}, {...carta}); // Agregar el par
      }
    }

    return this.desordenarBaraja(baraja); // Mezclar cartas de manera justa
  };

  desordenarBaraja(baraja: Carta[]): Carta[] {
    for (let i = baraja.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Selecciona un índice aleatorio dentro del rango válido
      [baraja[i], baraja[j]] = [baraja[j], baraja[i]]; // Intercambia los elementos
    }
    return baraja;
  }

  empezarCronometro() {
    this.idIntervalo = setInterval(() => {
      this.cronometro++;
    }, 1000); // Aumenta cada segundo
  }

  pararCronometro() {
    clearInterval(this.idIntervalo);
  }

  empezarJuego() {
    this.hayPartidaEnJuego = true;
    this.cronometro = 0;
    this.empezarCronometro();
  }


  girarYcomprobarCarta(carta: Carta) {

    if (!this.estaComprobando && !carta.estaGirada && !carta.estaEmparejada) {
      carta.estaGirada = true;
      this.cartasGiradas.push(carta);

      if (this.cartasGiradas.length === 2) {
        this.estaComprobando = true;
        setTimeout(() => {
          this.comprobarPareja();
          this.estaComprobando = false;
        }, 1000);
      }
    }
  }

  comprobarPareja() {
    const [carta1, carta2] = this.cartasGiradas;

    if (carta1.valor === carta2.valor && carta1.palo === carta2.palo) {
      setTimeout(() => {
        carta1.estaEmparejada = true;
        carta2.estaEmparejada = true;

        //Borrar la carta del array
        setTimeout(() => {
          this.cartas = this.cartas.filter(c => c !== carta1 && c !== carta2);
        }, 500); // 500ms = duración de la animación
      }, 50);
      this.parejasHechas++;
      this.comprobarFinDePartida();
    } else {
        carta1.estaGirada = false;
        carta2.estaGirada = false;
    }

    this.cartasGiradas = [];
  }

  comprobarFinDePartida() {
    if (this.parejasHechas === this.numParejas) {
      this.pararCronometro();
      setTimeout(() => { // pongo timeOut a 50 para que de tiempo a que desaparezca de pantalla la última pareja,
        //ya que al poner finPartida en true se muestra en pantalla el aviso de fin de partida y el botón de jugar de nuevo
        this.finPartida = true;
        this.hayPartidaEnJuego = false;
        // this.pararCronometro();
      }, 600);
      this.agregarAhistorial();
    }
  }

  agregarAhistorial() {
    let dificultad: string = '';
    if (this.dificultadElegida === 'facil') {
      dificultad = 'Fçcil';
    }
    if (this.dificultadElegida === 'intermedio') {
      dificultad = 'Intermedio';
    }
    if (this.dificultadElegida === 'dificil') {
      dificultad = 'Difêcil';
    }

    let lineaHistorial: Historial = {
      dificultad: dificultad,
      tiempo: this.formatearTiempo(this.cronometro),
      fecha: new Date(Date.now())
    };

    if (this.historial.length >= 10) {
      this.historial.shift();
    }

    this.historial.push(lineaHistorial);
    localStorage.setItem('historial', JSON.stringify(this.historial));
  }

  jugarDeNuevo() {
    this.finPartida = false;
    this.parejasHechas = 0;
    this.numParejas = 0;
    this.dificultadElegida = null;
    this.cartas = [];
  }


  formatearTiempo(segundos: number) {
    const minutos = Math.floor(segundos / 60); // Calcula los minutos
    const segundosRestantes = segundos % 60; // Calcula los segundos restantes
    return minutos.toString().padStart(2, '0') + ' : ' + segundosRestantes.toString().padStart(2, '0'); //padStart pone el 0 delante cuando haya solo 1 dígito
  }
}
