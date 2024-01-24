import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { timeToTimestamp } from '@app/utils/tools';
import { BaseHttpService } from '../../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(private http: BaseHttpService, private https: HttpClient, private date: DatePipe) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      spCode: filters.spCode || '',
      spName: filters.spName || '',
      formRatePlatform: filters.formRatePlatform || '',
      formRateCurrency: filters.formRateCurrency || '',
      toRatePlatform: filters.toRatePlatform || '',
      toRateCurrency: filters.toRateCurrency || '',
      bic: filters.bic || '',
      beginDate: filters.createTime[0] ? timeToTimestamp(this.date.transform(filters.createTime[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      endDate: filters.createTime[1] ? timeToTimestamp (this.date.transform(filters.createTime[1], 'yyyy-MM-dd')+' 23:59:59') : "",
    };
    return this.https.post('/v1/fxplt/sys/exchange/rate/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  
  
}
