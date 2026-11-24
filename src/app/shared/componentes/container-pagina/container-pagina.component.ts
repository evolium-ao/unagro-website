import { Component } from '@angular/core';


@Component({
  selector: 'app-container-pagina',
  standalone: true,
  host: {
    class: 'block mx-auto max-w-7xl px-4 sm:px-0 lg:px-0'
  },
  template: `<ng-content></ng-content>`
})
export class ContainerPaginaComponent {}
