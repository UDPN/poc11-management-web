import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { timeToTimestamp } from '@app/utils/tools';

export interface Adata {
  // platform: string;
  currency: string;
  contractAddress: string;
  provider: string;
  currencyPrecision: string;
}

export interface Edata {
  currencyCode: string;
  contractAddress: string;
  provider: string;
}

export interface Sdata {
  status: any;
  currencyCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class PocCurrencyService {

  constructor(private http: BaseHttpService, private https: HttpClient, private date: DatePipe) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      currencyCode: filters.currencyCode || '',
      platform: filters.platform || '',
      currency: filters.currency || '',
      symbol: filters.symbol || '',
      contractAddress: filters.contractAddress || '',
      provider: filters.provider || '',
      createBeginDate: filters.createTime[0] ? timeToTimestamp(this.date.transform(filters.createTime[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      updateEndDate: filters.createTime[1] ? timeToTimestamp(this.date.transform(filters.createTime[1], 'yyyy-MM-dd')+' 23:59:59') : "",
      status: filters.status,
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxplt/sys/currency/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getInfo(params: { currencyCode: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/currency/manage/detail/search`, params);
  }

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/currency/manage/save`, params);
  }

  public edit(params: Edata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/currency/manage/edit`, params);
  }

  public statusUpdate(params: Sdata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/currency/manage/status/update`, params);
  }
 
}
