import { Component } from '@angular/core';

@Component({
  selector: 'app-acordeao',
  template: `
    <div class="divide-y divide-gray-200 border-y border-gray-200">
      <ng-content />
    </div>
  `,
})
export class AcordeaoComponent {}
