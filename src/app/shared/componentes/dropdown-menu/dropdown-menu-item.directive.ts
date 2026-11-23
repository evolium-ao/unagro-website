import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dropdownMenuItem]',
  standalone: true,
})
export class DropdownMenuItemDirective {
  @Input('dropdownMenuItemOrder') order = 0;

  constructor(public templateRef: TemplateRef<unknown>) {}
}
