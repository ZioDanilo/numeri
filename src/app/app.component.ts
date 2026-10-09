import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

interface MagliaVirtus {
  id: number;
  atleta: string;
  numero: number;
  taglia: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <main class="page">
      <header class="site-header">
        <img class="club-logo" src="assets/Logo.png?v=20261009-2" alt="Logo Virtus Volley Versilia">
        <div class="heading">
          <h1>Virtus Volley Versilia</h1>
          <p>Scelta maglie</p>
        </div>
      </header>
      <section class="selectors" aria-label="Scelta maglie">
        <label>Atleta
          <select name="atleta" #atletaSelect (change)="atletaScelto = atletaSelect.value" [disabled]="loading || !!loadError">
            <option value="" selected disabled>Seleziona atleta</option>
            <option *ngFor="let nome of atletiDisponibili" [value]="nome">{{ nome }}</option>
          </select>
        </label>
        <label>Numero
          <select name="numero" #numeroSelect (change)="numeroScelto = numeroSelect.value" [disabled]="loading || !!loadError">
            <option value="" selected disabled>Seleziona numero</option>
            <option *ngFor="let n of numeriDisponibili" [value]="n">{{ n }}</option>
          </select>
        </label>
        <label>Taglia
          <select name="taglia" #tagliaSelect (change)="tagliaScelta = tagliaSelect.value" [disabled]="loading || !!loadError">
            <option value="" selected disabled>Seleziona taglia</option>
            <option *ngFor="let t of taglie" [value]="t">{{ t }}</option>
          </select>
        </label>
      </section>
      <div class="save-actions">
        <button type="button" [disabled]="saving || loading || !!loadError || !atletaScelto || !numeroScelto || !tagliaScelta"
          (click)="salva(atletaSelect, numeroSelect, tagliaSelect)">
          {{ saving ? 'Salvataggio...' : 'Salva' }}
        </button>
        <p role="status" aria-live="polite">{{ messaggio }}</p>
      </div>

      <section class="results" aria-label="Maglie assegnate">
        <h2>Maglie assegnate</h2>
        <p *ngIf="loading">Caricamento maglie...</p>
        <p *ngIf="loadError" role="alert">{{ loadError }}
          <button type="button" class="retry" (click)="caricaMaglie()">Riprova</button>
        </p>
        <div *ngIf="!loading && !loadError" class="table-scroll">
          <table>
            <thead><tr><th>Numero</th><th>Atleta</th><th>Taglia</th><th aria-label="Elimina"></th></tr></thead>
            <tbody>
              <tr *ngFor="let maglia of maglie">
                <td>{{ maglia.numero }}</td>
                <td>{{ maglia.atleta }}</td>
                <td>{{ maglia.taglia }}</td>
                <td class="action-cell">
                  <button class="delete-button" type="button" [disabled]="deletingId === maglia.id"
                    [attr.aria-label]="'Elimina maglia di ' + maglia.atleta"
                    [title]="'Elimina maglia di ' + maglia.atleta"
                    (click)="elimina(maglia)">
                    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor"
                      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M4 7h16M10 4h4M6 7l1 13h10l1-13M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="maglie.length === 0"><td colspan="4">Nessuna maglia assegnata</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  atleti = ['Alessio', 'Andrea', 'Asia', 'Cristiano', 'Daniele', 'Francesca', 'Giacomo', 'Joshua', 'Lillo', 'Lorenzo', 'Luca', 'Martina', 'Michela', 'Paolo', 'Sara D.', 'Sara M.', 'Sonia', 'Vale'];
  numeri = Array.from({ length: 99 }, (_, i) => i + 1);
  taglie = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  maglie: MagliaVirtus[] = [];
  loading = true;
  loadError = '';
  atletaScelto = '';
  numeroScelto = '';
  tagliaScelta = '';
  saving = false;
  deletingId: number | null = null;
  messaggio = '';

  private readonly baseUrl = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://investment-lab-service.onrender.com/api';

  get atletiDisponibili(): string[] {
    const assegnati = new Set(this.maglie.map(m => m.atleta.trim()));
    return this.atleti.filter(nome => !assegnati.has(nome));
  }

  get numeriDisponibili(): number[] {
    const assegnati = new Set(this.maglie.map(m => m.numero));
    return this.numeri.filter(numero => !assegnati.has(numero));
  }

  ngOnInit(): void { void this.caricaMaglie(); }

  async caricaMaglie(): Promise<void> {
    this.loading = true;
    this.loadError = '';
    try {
      const response = await fetch(this.baseUrl + '/maglie-virtus', { cache: 'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Risposta non valida');
      this.maglie = (data as MagliaVirtus[]).sort((a, b) => a.numero - b.numero);
    } catch {
      this.loadError = 'Impossibile caricare le maglie dal database.';
    } finally {
      this.loading = false;
    }
  }

  async salva(atletaSelect: HTMLSelectElement, numeroSelect: HTMLSelectElement, tagliaSelect: HTMLSelectElement): Promise<void> {
    const atleta = atletaSelect.value;
    const numero = Number(numeroSelect.value);
    const taglia = tagliaSelect.value;
    if (!atleta || !numeroSelect.value || !taglia) {
      this.messaggio = 'Seleziona atleta, numero e taglia.';
      return;
    }
    this.saving = true;
    this.messaggio = '';
    try {
      const response = await fetch(this.baseUrl + '/maglie-virtus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atleta, numero, taglia })
      });
      if (response.status === 409) throw new Error('Atleta o numero già assegnato. Aggiorna la pagina.');
      if (!response.ok) throw new Error('Salvataggio non riuscito.');
      atletaSelect.value = '';
      numeroSelect.value = '';
      tagliaSelect.value = '';
      this.atletaScelto = '';
      this.numeroScelto = '';
      this.tagliaScelta = '';
      await this.caricaMaglie();
      this.messaggio = this.loadError || 'Scelta salvata correttamente.';
    } catch (error) {
      this.messaggio = error instanceof Error ? error.message : 'Salvataggio non riuscito.';
      await this.caricaMaglie();
    } finally {
      this.saving = false;
    }
  }

  async elimina(maglia: MagliaVirtus): Promise<void> {
    if (this.deletingId !== null) return;
    if (!confirm('Eliminare la maglia di ' + maglia.atleta + ' (n. ' + maglia.numero + ')?')) return;
    this.deletingId = maglia.id;
    this.messaggio = '';
    try {
      const response = await fetch(this.baseUrl + '/maglie-virtus/' + maglia.id, { method: 'DELETE' });
      if (!response.ok) throw new Error('Cancellazione non riuscita.');
      await this.caricaMaglie();
      this.messaggio = this.loadError || 'Maglia eliminata.';
    } catch (error) {
      this.messaggio = error instanceof Error ? error.message : 'Cancellazione non riuscita.';
    } finally {
      this.deletingId = null;
    }
  }
}
