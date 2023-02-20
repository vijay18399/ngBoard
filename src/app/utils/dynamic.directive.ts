import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[canvasDir]',
})
export class DynamicDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
