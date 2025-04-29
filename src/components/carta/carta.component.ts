import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Carta} from '../../models/carta.model';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-carta',
  imports: [
    NgClass,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.scss'
})
export class CartaComponent {
  @Input() carta!: Carta;
  @Output() cartaGirada = new EventEmitter<Carta>();

  girarCarta() {
    if (!this.carta.estaGirada && !this.carta.estaEmparejada) {
      this.cartaGirada.emit(this.carta); // Notificar al inicio.component que se ha girado una carta
    }
  }
}
