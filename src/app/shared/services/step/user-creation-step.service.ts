import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserCreationStepService {

  step: 0 | 1 | 2 | 3 = 1;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.step = 0;
  }
}
