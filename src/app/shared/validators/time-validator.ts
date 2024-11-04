import { AbstractControl, ValidationErrors } from '@angular/forms';

export function timeRangeValidator(control: AbstractControl): ValidationErrors | null {
  const openingTime = control.get('opening_time')?.value;
  const closingTime = control.get('closing_time')?.value;

  if (openingTime && closingTime && openingTime >= closingTime) {
    return { invalidTime: true }; 
  }
  return null;
}