import {Component, OnInit} from '@angular/core';
import {StatisticsService} from "@shared/services/business/statistics.service";
import {NzMessageService} from "ng-zorro-antd";
import * as format from 'date-fns/format';
import {Statistics} from "@shared/models/business/statistics";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {

  data: Statistics = {};
  visitData: any[] = [];

  constructor(
    public messageService: NzMessageService,
    private statisticsService: StatisticsService
  ) { }

  ngOnInit() {
    this.statisticsService
      .stat()
      .pipe(tap())
      .subscribe(
        (data) => {
          this.data = data;
        },
        (error) => {
          this.messageService.warning('获取统计数据失败。');
          console.error(error);
        },
        () => {
          this.messageService.warning('统计数据流已经结束。');
        });

    const beginDay = new Date().getTime();
    for (let i = 0; i < 20; i += 1) {
      this.visitData.push({
        x: format(new Date(beginDay + (1000 * 60 * 60 * 24 * i)), 'YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10,
      });
    }
  }

}
