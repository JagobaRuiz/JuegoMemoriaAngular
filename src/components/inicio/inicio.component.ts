import { Component } from '@angular/core';
import {Carta} from '../../models/carta.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [
    NgIf
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

  elegirDificultad(nivel: string) {
    this.dificultadElegida = nivel;
    // this.cartas = generarCartas(this.nivelesDificultad[nivel]); // Genera cartas con el nivel elegido
  }

  // const generateCards = (pairCount: number): Card[] => {
  //   const deck: Card[] = [];
  //
  //   while (deck.length < pairCount * 2) {
  //     const value = values[Math.floor(Math.random() * values.length)];
  //     const suit = suits[Math.floor(Math.random() * suits.length)];
  //     const imagePath = `assets/cards/${value.toLowerCase()}_${suit.toLowerCase()}.png`;
  //
  //     const card: Card = { id: deck.length, value, suit, image: imagePath, isFlipped: false, isMatched: false };
  //
  //     if (!deck.some(c => c.value === card.value && c.suit === card.suit)) {
  //       deck.push({...card}, {...card}); // Agregar el par
  //     }
  //   }
  //
  //   return shuffleFisherYates(deck); // Mezclar cartas de manera justa
  // };










}
