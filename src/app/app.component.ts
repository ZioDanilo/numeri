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
          <select name="atleta" #atletaSelect>
            <option value="" disabled>Seleziona atleta</option>
            <option *ngFor="let nome of atleti" [value]="nome">{{ nome }}</option>
          </select>
        </label>
        <label>Numero
          <select name="numero" #numeroSelect>
            <option value="" disabled>Seleziona numero</option>
            <option *ngFor="let n of numeri" [value]="n">{{ n }}</option>
          </select>
        </label>
        <label>Taglia
          <select name="taglia" #tagliaSelect>
            <option value="" disabled>Seleziona taglia</option>
            <option *ngFor="let t of taglie" [value]="t">{{ t }}</option>
          </select>
        </label>
      </section>
      <div class="save-actions">
        <button type="button" [disabled]="saving" (click)="salva(atletaSelect.value, numeroSelect.value, tagliaSelect.value)">{{ saving ? 'Salvataggio...' : 'Salva' }}</button>
        <p role="status" aria-live="polite">{{ messaggio }}</p>
      </div>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  atleti = ['Alessio', 'Alessio', 'Andrea', 'Asia', 'Cristiano', 'Daniele', 'Francesca', 'Giacomo', 'Joshua', 'Lillo', 'Lorenzo', 'Luca', 'Paolo', 'Sara', 'Sara M.', 'Sonia'];
  numeri = Array.from({ length: 99 }, (_, i) => i + 1);
  taglie = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  saving = false;
  messaggio = '';

  async salva(atleta: string, numero: string, taglia: string): Promise<void> {
    if (!atleta || !numero || !taglia) {
      this.messaggio = 'Seleziona atleta, numero e taglia.';
      return;
    }
    this.saving = true;
    this.messaggio = '';
    const baseUrl = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : 'https://api.investment-lab.com/api';
    try {
      const response = await fetch(baseUrl + '/maglie-virtus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atleta, numero: Number(numero), taglia })
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      this.messaggio = 'Scelta salvata correttamente.';
    } catch {
      this.messaggio = 'Salvataggio non riuscito. Verifica la connessione al servizio.';
    } finally {
      this.saving = false;
    }
  }
}
