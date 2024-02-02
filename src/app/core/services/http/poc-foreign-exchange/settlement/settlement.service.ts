import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from '../../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {

  constructor(private http: BaseHttpService, private https: HttpClient) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      settlementModelCode : filters.settlementModelCode || '',
      settlementModelName: filters.settlementModelName || '',
      spCode: filters.spCode || '',
      spName: filters.spName || '',
      formRatePlatform: filters.formRatePlatform || '',
      formRateCurrency: filters.formRateCurrency || '',
      toRatePlatform: filters.toRatePlatform || '',
      toRateCurrency: filters.toRateCurrency || '',
      chargingModel: filters.chargingModel || '',
      bic: filters.bic || '',
    };
    return this.https.post('/v1/fxplt/sys/settlement/model/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getInfo(params: { settlementModelCode: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/settlement/model/manage/detail/search`, params);
  }

}
