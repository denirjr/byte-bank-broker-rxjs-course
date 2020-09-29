import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge } from 'rxjs';
import { filter, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AcoesService } from './acoes.service';

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  private readonly ESPERA_DIGITACAO: number = 300;

  public acoesInput = new FormControl();
  todasAcoes$ = this.acoesService
    .getAcoes()
    .pipe(tap(() => console.log('fluxo inicial')));
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(this.ESPERA_DIGITACAO),
    tap(() => console.log('fluxo do filtro')),
    tap(console.log),
    filter(
      (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
    ),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado))
  );

  public acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);
  constructor(private acoesService: AcoesService) {}
}
