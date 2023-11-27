import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessActivationService {

  constructor(private http: BaseHttpService, private https: HttpClient) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      applicationCode : filters.applicationCode || '',
      spCode: filters.spCode || '',
      spName: filters.spName || '',
      applicationFormRatePlatform: filters.applicationFormRatePlatform || '',
      applicationFormRateCurrency: filters.applicationFormRateCurrency || '',
      applicationToRatePlatform: filters.applicationToRatePlatform || '',
      applicationToRateCurrency: filters.applicationToRateCurrency || '',
      platform: filters.platform || '',
      currency: filters.currency || ''
    };
    return this.https.post('/v1/fxplt/sys/business/activation/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

}
