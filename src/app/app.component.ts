import { Component } from '@angular/core';

@Component({ selector: 'app-root', standalone: true, template: '<main><h1>Numeri Virtus <span>26-27</span></h1></main>', styles: [``:host{display:block;min-height:100dvh}main{min-height:100dvh;display:flex;align-items:flex-start;justify-content:center;box-sizing:border-box;padding:clamp(48px,10vh,110px) 20px 40px;background:#101925 url('/assets/volley-background.svg') center center / cover no-repeat;color:#f8f4ea}h1{margin:0;text-align:center;font:800 clamp(2rem,5vw,5rem)/1.12 Arial,sans-serif;letter-spacing:-.035em;text-shadow:0 3px 25px #000a}h1 span{color:#e1ba73}@media(max-width:600px){main{padding-top:65px;background-position:58% center}h1{font-size:clamp(2rem,9vw,3rem)}}`] })
export class AppComponent {}
