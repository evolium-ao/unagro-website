import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dropdownMenuTrigger]',
  standalone: true,
})
export class DropdownMenuTriggerDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
