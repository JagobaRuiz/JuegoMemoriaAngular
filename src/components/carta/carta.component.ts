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
    ])
  ]
})
export class CartaComponent implements AfterViewChecked {
  @Input() carta!: Carta;
  @Output() cartaGirada = new EventEmitter<Carta>();
  // estadoCarta: string = 'visible'

  constructor(private cdRef: ChangeDetectorRef) {
  }

  girarCarta() {
    if (!this.carta.estaGirada && !this.carta.estaEmparejada) {
      this.cartaGirada.emit(this.carta); // Notificar al inicio.component que se ha girado una carta
    }
  }


  get estadoCarta() {
    console.log('Estado de la carta:', this.carta.estaEmparejada ? 'oculto' : 'visible');
    return this.carta.estaEmparejada ? 'oculto' : 'visible'; //Devuelve oculto si está emparejada o visible si todavía no está emparejada
  }

  ngAfterViewChecked(): void {
    // this.estadoCarta =  this.carta.estaEmparejada ? 'oculto' : 'visible';
    this.cdRef.detectChanges();
    console.log('Estado de la carta:', this.carta.estaEmparejada ? 'oculto' : 'visible');
  }
}
