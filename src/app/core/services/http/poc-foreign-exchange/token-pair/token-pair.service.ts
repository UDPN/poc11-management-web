import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, map } from 'rxjs';
import { timeToTimestamp } from '@app/utils/tools';

export interface Udata {
  exchangeId: any;
  status: any;
  comments: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenPairService {
  constructor(
    private http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}

  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      formRateCurrency: filters.formRateCurrency || '',
      toRateCurrency: filters.toRateCurrency || '',
      status: filters.status || '',
      beginDate: filters.updatedTime[0]
        ? timeToTimestamp(
            this.date.transform(filters.updatedTime[0], 'yyyy-MM-dd') +
              ' 00:00:00'
          )
        : '',
      endDate: filters.updatedTime[1]
        ? timeToTimestamp(
            this.date.transform(filters.updatedTime[1], 'yyyy-MM-dd') +
              ' 23:59:59'
          )
        : ''
    };
    return this.https.post('/v1/fxplt/sys/exchange/rate/listPage', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getBasicInfo(params: { exchangeId: string }): Observable<any> {
    return this.http.post(
      `/v1/fxplt/sys/exchange/rate/details/information`,
      params
    );
  }

  public getRecordsInfo(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      exchangeId: filters.exchangeId || '',
      operationType: filters.operationType || ''
    };
    return this.https
      .post('/v1/fxplt/sys/exchange/rate/details/records', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public updateStatus(params: Udata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/exchange/rate/update/status`, params);
  }

  public save(params: Array<any>): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/exchange/rate/save`, params);
  }

  public getHistoryInfoList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      exchangeId: filters.exchangeId || '',
      beginDate: filters.createTime[0]
        ? timeToTimestamp(
            this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
              ' 00:00:00'
          )
        : '',
      endDate: filters.createTime[1]
        ? timeToTimestamp(
            this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
              ' 23:59:59'
          )
        : ''
    };
    return this.https
      .post('/v1/fxplt/sys/exchange/rate/details/history', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getCreateTokenPairList(): Observable<any> {
    return this.http.get(`/v1/fxplt/sys/exchange/rate/save/tokenPairList`);
  }

  public getTokenPair(): Observable<any> {
    return this.http.get(`/v1/fxplt/sys/exchange/rate/listPage/tokenPairList`);
  }
}
