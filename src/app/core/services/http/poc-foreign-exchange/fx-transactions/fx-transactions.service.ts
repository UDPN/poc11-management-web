import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';
import { BaseHttpService } from '../../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class FxTransactionsService {

  constructor(private http: BaseHttpService,private https: HttpClient, private date: DatePipe) { }
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
      transactionNo: filters.transactionNo || '',
      transactionHash: filters.transactionHash || '',
      formPlatform: filters.formPlatform || '',
      formCurrency: filters.formCurrency || '',
      toPlatform: filters.toPlatform || '',
      toCurrency: filters.toCurrency || '',
      fromBnId: filters.fromBnId || '',
      fromBankId: filters.fromBankId || '',
      fromBankName: filters.fromBankName || '',
      startDate: filters.creation[0] ? timeToTimestamp(this.date.transform(filters.creation[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      endDate: filters.creation[1] ? timeToTimestamp (this.date.transform(filters.creation[1], 'yyyy-MM-dd')+' 23:59:59') : "",
    };
    return this.https.post('/v1/fxplt/sys/transaction/page/list', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public info(params: { transactionNo: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/transaction/detail`, params);
  }


}
