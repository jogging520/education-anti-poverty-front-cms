import { Injectable } from '@angular/core';
import {Observable} from "rxjs/index";
import {environment} from "@env/environment";
import {Statistics} from "@shared/models/business/statistics";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  webSocket: WebSocket;

  constructor() { }

  /**
   * 方法：统计
   * @return {Observable<any>} 统计结果流
   */
  public stat(): Observable<Statistics> {
    this.webSocket = new WebSocket(`${environment.webSocketUrl}statistics`);

    return new Observable(
      observer => {
        this.webSocket.onmessage = (event) => observer.next(JSON.parse(event.data));
        this.webSocket.onerror = (event) => observer.error(event);
        this.webSocket.onclose = (event) => observer.complete();
      }
    );
  }
}
