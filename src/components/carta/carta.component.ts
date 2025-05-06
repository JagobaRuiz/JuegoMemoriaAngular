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
export class CartaComponent /*implements AfterViewChecked*/ {
  @Input() carta!: Carta;
  @Output() cartaGirada = new EventEmitter<Carta>();

  constructor(private cdRef: ChangeDetectorRef) {
  }

  girarCarta(carta: HTMLElement) {
    if (!this.carta.estaGirada && !this.carta.estaEmparejada) {
      this.cartaGirada.emit(this.carta); // Notificar al inicio.component que se ha girado una carta
      // carta.classList.add('girada');
      if (carta.classList.contains('girada')) {
        carta.classList.remove('girada'); // Si ya está girada, la quitamos
      } else {
        carta.classList.add('girada'); // Si no está girada, la agregamos
      }
    }
  }


  get estadoCarta() {
    return this.carta.estaEmparejada ? 'oculto' : 'visible'; //Devuelve oculto si está emparejada o visible si todavía no está emparejada
  }

  /*ngAfterViewChecked(): void { //Actualiza cuando detecta cambios para ejecutar el get estadoCarta ya que de eso depende el efecto de desaparecer
    // this.cdRef.detectChanges();
  }*/
}
