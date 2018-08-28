import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';

@Component({
  selector: 'app-system-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.less'],
})
export class SystemPrivilegeComponent implements OnInit {

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() { }


}
