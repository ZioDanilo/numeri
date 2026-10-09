import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  template: `
    <main class="page">
      <header class="site-header">
        <img class="club-logo" src="assets/Logo.png" alt="Logo Virtus Volley Versilia">
        <div class="heading">
          <h1>Virtus Volley Versilia</h1>
          <p>Scelta maglie</p>
        </div>
      </header>
      <section class="selectors" aria-label="Scelta maglie">
        <label>Atleta
          <select name="atleta">
            <option value="" disabled>Seleziona atleta</option>
            <option *ngFor="let nome of atleti; let i = index" [value]="i">{{ nome }}</option>
          </select>
        </label>
        <label>Numero
          <select name="numero">
            <option value="" disabled>Seleziona numero</option>
            <option *ngFor="let n of numeri" [value]="n">{{ n }}</option>
          </select>
        </label>
        <label>Taglia
          <select name="taglia">
            <option value="" disabled>Seleziona taglia</option>
            <option *ngFor="let t of taglie" [value]="t">{{ t }}</option>
          </select>
        </label>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  atleti = ['Giacomo', 'Alessio', 'Lorenzo', 'Sonia', 'Asia', 'Paolo', 'Daniele', 'Francesca', 'Joshua', 'Sara', 'Sara Mastro', 'Luca', 'Alessio', 'Andrea', 'Lillo', 'Cristiano'];
  numeri = Array.from({ length: 99 }, (_, i) => i + 1);
  taglie = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  atleta = '';
  numero = '';
  taglia = '';
}
