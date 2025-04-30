import { Component } from '@angular/core';
import {Carta} from '../../models/carta.model';
import {NgForOf, NgIf} from '@angular/common';
import {CartaComponent} from '../carta/carta.component';

@Component({
  selector: 'app-inicio',
  imports: [
    NgIf,
    CartaComponent,
    NgForOf
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  nivelesDificultad = {
    facil: 3,
    intermedio: 6,
    dificil: 12
  };

  dificultadElegida: string | null = null;
  cartas: Carta[] = [];
  palos = ['picas', 'corazones', 'diamantes', 'treboles'];
  valores = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];

  cartasGiradas: Carta[] = [];
  estaComprobando = false;
  parejasHechas: number = 0;
  numParejas: number = 0;
  finPartida: boolean = false;

  elegirDificultad(nivel: string) {
    this.dificultadElegida = nivel;
    this.cartas = this.generarCartas(this.nivelesDificultad[nivel as keyof typeof this.nivelesDificultad]); // Genera un número de cartas acorde a la dificultad elegida
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


  girarYcomprobarCarta(carta: Carta) {
    // console.log(carta);
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

      // console.log(carta1.estaEmparejada + ' - ' + carta2.estaEmparejada);
    } else {
        carta1.estaGirada = false;
        carta2.estaGirada = false;
    }

    this.cartasGiradas = [];
  }

  comprobarFinDePartida() {
    if (this.parejasHechas === this.numParejas) {
      this.finPartida = true;
    }
  }







}
