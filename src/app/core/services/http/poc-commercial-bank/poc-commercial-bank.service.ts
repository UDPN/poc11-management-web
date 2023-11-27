import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Adata {
  commercialBankName: string;
  countryInfoId: string;
  // countryInfoString: string;
  commercialBankIntroduction: string;
  besuWalletAddress: string;
  bnCode: string;
  agreementUrl: string;
}

export interface Edata {
  commercialBankCode: string,
  commercialBankName: string;
  countryInfoId: string;
  // countryInfoString: string;
  commercialBankIntroduction: string;
  besuWalletAddress: string;
  bnCode: string;
  agreementUrl: string;
}

export interface Sdata {
  commercialBankCode: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PocCommercialBankService {

  constructor(private http: BaseHttpService, private https: HttpClient, private date: DatePipe) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      commercialBankCode : filters.commercialBankCode || '',
      commercialBankName: filters.commercialBankName || '',
      commercialBankIntroduction: filters.commercialBankIntroduction || '',
      bnCode: filters.bnCode || '',      
      status: filters.status,
      createBeginTime: filters.createTime[0] ? timeToTimestamp(this.date.transform(filters.createTime[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      createEndTime: filters.createTime[1] ? timeToTimestamp(this.date.transform(filters.createTime[1], 'yyyy-MM-dd')+' 23:59:59') : ""
    };
    return this.https.post('/v1/fxplt/sys/commercial/bank/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public info(params: { commercialBankCode: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/commercial/bank/manage/detail`, params);
  }

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/commercial/bank/manage/save`, params);
  }

  public edit(params: Edata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/commercial/bank/manage/edit`, params);
  }

  public statusUpdate(params: Sdata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/commercial/bank/manage/status/update`, params);
  }

}
