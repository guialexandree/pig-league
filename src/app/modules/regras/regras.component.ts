import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-regras',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet/>
  `,
})
export class RegrasComponent {}
