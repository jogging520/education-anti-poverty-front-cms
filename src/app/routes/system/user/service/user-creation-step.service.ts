import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserCreationStepService {

  step: 0 | 1 | 2 | 3 = 0;

  constructor() { }
}
