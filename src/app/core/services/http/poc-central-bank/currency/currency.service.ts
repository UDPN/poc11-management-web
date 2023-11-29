import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { timeToTimestamp } from '@app/utils/tools';
import { BaseHttpService } from '../../base-http.service';

export interface Adata {
  // platform: string;
  currency: string;
  contractAddress: string;
  centralBankCode: string;
  currencyPrecision: string;
}

export interface Edata {
  currencyCode: string;
  contractAddress: string;
  centralBankCode: string;
}

export interface Sdata {
  status: any;
  currencyCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: BaseHttpService, private https: HttpClient, private date: DatePipe) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      currencyCode: filters.currencyCode || '',
      currency: filters.currency || '',
      symbol: filters.currency || '',
      contractAddress: filters.contractAddress || '',
      centralBankCode: filters.centralBankCode || '',
      createBeginDate: filters.createTime[0] ? timeToTimestamp(this.date.transform(filters.createTime[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      createEndDate: filters.createTime[1] ? timeToTimestamp(this.date.transform(filters.createTime[1], 'yyyy-MM-dd')+' 23:59:59') : "",
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
