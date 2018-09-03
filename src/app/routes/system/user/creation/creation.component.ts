import { Component, OnInit } from '@angular/core';
import {UserCreationStepService} from "../service/user-creation-step.service";

@Component({
  selector: 'app-system-user-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.less']
})
export class SystemUserCreationComponent implements OnInit {


  constructor(
    public item: UserCreationStepService
  ) {}

  ngOnInit(): void {
  }

}
