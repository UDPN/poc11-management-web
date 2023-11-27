import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Adata {
  businessApplicationCode: string;
  approvalResult: string;
  comments: string;
}

@Injectable({
  providedIn: 'root'
})
export class FxApplicationService {

  constructor(private http: BaseHttpService, private https: HttpClient, private date: DatePipe) { }
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
      businessType: filters.businessType || '',
      applicationBeginTime: filters.createTime[0] ? timeToTimestamp(this.date.transform(filters.createTime[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      applicationEndTime: filters.createTime[1] ? timeToTimestamp (this.date.transform(filters.createTime[1], 'yyyy-MM-dd')+' 23:59:59') : "",
      status: filters.status,
    };
    return this.https.post('/v1/fxplt/sys/fx/application/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getInfo(params: { businessApplicationCode: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/fx/application/manage/detail/search`, params);
  }

  public approve(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/fx/application/manage/approve`, params);
  }
  
  
}
