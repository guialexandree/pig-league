import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-main-template',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './main-template.html',
  styleUrl: './main-template.scss',
})
export class MainTemplateComponent {}
