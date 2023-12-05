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

export interface Apdata {
  spCode: string;
  approvalResult: string;
  comments: string;
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
      spChainCode : filters.spChainCode || '',
      spName: filters.spName || '',
      centralBankChainId: filters.centralBankChainId || '',
      bankType: filters.bankType || '',
    };
    return this.https.post('/v1/fxplt/sys/active/bank/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public info(params: { spCode: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/active/bank/manage/detail`, params);
  }

}
