import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="page">
      <header class="site-header">
        <img class="club-logo" src="assets/Logo.png" alt="Logo Virtus Volley Versilia">
        <div class="heading">
          <h1>Virtus Volley Versilia</h1>
          <p>Scelta maglie</p>
        </div>
      </header>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
