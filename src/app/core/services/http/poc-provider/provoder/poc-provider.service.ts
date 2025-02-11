/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:32:33
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-10 16:52:29
 * @Description:
 */
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Adata {
  spCode: string;
  approvalResult: string;
  comments: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
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
      spCode: filters.spCode || '',
      spChainCode: filters.spChainCode || '',
      spName: filters.spName || '',
      startDate: filters.createTime[0]
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
        : '',
      status: filters.status
    };
    return this.https
      .post('/v1/fxplt/sys/service/provider/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getInfo(params: { spCode: string }): Observable<any> {
    return this.http.post(
      `/v1/fxplt/sys/service/provider/manage/detail`,
      params
    );
  }

  public approve(params: Adata): Observable<any> {
    return this.http.post(
      `/v1/fxplt/sys/service/provider/manage/audit`,
      params
    );
  }
}
