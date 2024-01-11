import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Adata {
  centralBankName: string;
  centralBankIntroduction: string;
  bnCode: string;
  bic: string;
  agreementUrl: string;
  countryInfoId: any;
  besuWalletAddress: string;
}

export interface Edata {
  bankCode: string;
  centralBankIntroduction: string;
  bnCode: string;
  agreementUrl: string;
  countryInfoId: any;
  besuWalletAddress: string;
}

export interface Sdata {
  bankCode: string;
  status: any;
}

@Injectable({
  providedIn: 'root'
})
export class CentralBankRegistService {

  constructor(private http: BaseHttpService, private https: HttpClient, private date: DatePipe) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      chainBankId : filters.chainBankId || '',
      bankName: filters.bankName || '',
      bnCode: filters.bnCode || '',
      status: filters.status,
      bic: filters.bic || '',
      createStartDate: filters.createTime[0] ? timeToTimestamp(this.date.transform(filters.createTime[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      createEndDate: filters.createTime[1] ? timeToTimestamp(this.date.transform(filters.createTime[1], 'yyyy-MM-dd')+' 23:59:59') : ""
    };
    return this.https.post('/v1/fxplt/sys/central/bank/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public info(params: { bankCode: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/central/bank/manage/detail/search`, params);
  }

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/central/bank/manage/save`, params);
  }

  public edit(params: Edata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/central/bank/manage/edit`, params);
  }

  public statusUpdate(params: Sdata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/central/bank/manage/status/update`, params);
  }
}
