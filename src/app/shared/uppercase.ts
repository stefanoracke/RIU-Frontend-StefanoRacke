import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class Uppercase {

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    if (input.value !== upperValue) {
      input.value = upperValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  constructor() { }

}
