import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-listagem-header',
  standalone: true,
  templateUrl: './listagem-header.component.html',
  styleUrl: './listagem-header.component.scss',
})
export class ListagemHeaderComponent implements OnChanges {
  readonly defaultLogoSources = ['/assets/img/logo.png', 'assets/img/logo.png', '/browser/assets/img/logo.png'];

  @Input() eyebrow = '';
  @Input() title = '';
  @Input() showLogo = true;
  @Input() logoAlt = 'Pig League';
  @Input() logoSources: string[] = this.defaultLogoSources;
  @Input() testIdPrefix = 'listagem';

  currentLogoIndex = 0;
  logoSrc = this.logoSources[this.currentLogoIndex] ?? this.defaultLogoSources[0];

  ngOnChanges(): void {
    this.currentLogoIndex = 0;
    this.logoSrc = this.logoSources[0] ?? this.defaultLogoSources[0];
  }

  onLogoError(event: Event): void {
    const logoElement = event.target as HTMLImageElement | null;
    const nextLogoIndex = this.currentLogoIndex + 1;

    if (!logoElement || nextLogoIndex >= this.logoSources.length) {
      return;
    }

    this.currentLogoIndex = nextLogoIndex;
    this.logoSrc = this.logoSources[this.currentLogoIndex];
    logoElement.src = this.logoSrc;
  }
}
