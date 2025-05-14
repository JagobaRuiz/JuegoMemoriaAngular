import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {Carta} from '../../models/carta.model';
import {CommonModule, NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-carta',
  imports: [
    NgClass,
    NgOptimizedImage,
    NgIf,
    CommonModule
  ],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.scss',
  animations: [
    trigger('desaparecer', [
      state('visible', style({ opacity: 1 })),
      state('oculto', style({ opacity: 0, transform: 'scale(0)' })),
      transition('visible => oculto', [animate('0.5s ease-out')])
    ]),
    trigger('girarCarta', [
      state('girada', style({ transform: 'rotateY(180deg)' })),
      state('normal', style({ transform: 'rotateY(0deg)' })),
      transition('normal <=> girada', animate('0.5s ease-in-out'))
    ])
  ]
})
export class CartaComponent {
  @Input() carta!: Carta;
  @Output() cartaGirada = new EventEmitter<Carta>();

  constructor() {
  }

  girarCarta() {
    if (!this.carta.estaGirada && !this.carta.estaEmparejada) {
      this.cartaGirada.emit(this.carta); // Notificar al inicio.component que se ha girado una carta
    }
  }


  get estadoCarta() {
    return this.carta.estaEmparejada ? 'oculto' : 'visible'; //Devuelve oculto si está emparejada o visible si todavía no está emparejada
  }

  get estaGirada () {
    return this.carta.estaGirada ? 'girada' : 'normal';
  }
}
