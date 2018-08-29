import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-system-user-detail',
  templateUrl: './detail.component.html',
})
export class SystemUserDetailComponent implements OnInit {



  constructor(
    private route: ActivatedRoute,
    public _location: Location,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
  }


}
