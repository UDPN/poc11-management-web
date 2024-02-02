import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';

export interface Pages {
  pageNum: number,
  pageSize: number
}

export interface Gdata {
  centralBankCode: any,
  commercialBankCode: any
}

export interface Rdata {
  spCode: any,
  sourceCurrency: any,
  sourcePlatform: any,
  targetCurrency: any,
  targetPlatform: any,
}


export interface InPages {
  inPage: Pages
}
@Injectable({
  providedIn: 'root'
})
export class PocDashBoardService {

  constructor(private http: BaseHttpService, private https: HttpClient) { }
  public getBankNumber(): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/dashboard/bank/number/select`, {});
  }

  public getVolumeSelectBank(): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/dashboard/bank/info/select`, {});
  }

  public getVolumeChart(params: Gdata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/dashboard/transaction/statistics`, params);
  }

  public getRateChart(params: Rdata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/dashboard/history/exchange/rate/dynamics/searches`, params);
  }

  public getBankInfo(): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/dashboard/centralBank/information/statistics/searches`, {});
  }

  public getSpList(
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxplt/sys/dashboard/splist/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  
}
