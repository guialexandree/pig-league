import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-screen-loader',
  standalone: true,
  templateUrl: './screen-loader.component.html',
  styleUrl: './screen-loader.component.scss',
})
export class ScreenLoaderComponent implements OnChanges {
  readonly defaultLogoSources = ['/assets/img/logo.png', 'assets/img/logo.png', '/browser/assets/img/logo.png'];

  @Input() visible = false;
  @Input() message = 'Carregando...';
  @Input() logoAlt = 'Pig League';
  @Input() showLogo = true;
  @Input() logoSources: string[] = this.defaultLogoSources;
  @Input() testIdPrefix = 'screen';

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
