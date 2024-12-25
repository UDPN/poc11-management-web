/*
 * @Author: chenyuting
 * @Date: 2024-12-24 15:30:46
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-25 09:48:03
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from '../base-http.service';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { timeToTimestamp } from '@app/utils/tools';

export interface Adata {
  title: string;
  top: string | number;
  content: string;
  type: number;
  systemAnnouncementType: any;
}

export interface Udata {
  msgCode: string;
  systemAnnouncementType: string | number;
  status: number | string;
}

export interface Idata {
  msgCode: string;
  systemAnnouncementType: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class PocNotificationsService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}

  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      title: filters.title || '',
      top: filters.top || '',
      systemAnnouncementType: filters.systemAnnouncementType || '',
      createStartDate: filters.createTime[0]
        ? timeToTimestamp(
            this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
              ' 00:00:00'
          )
        : '',
      createEndDate: filters.createTime[1]
        ? timeToTimestamp(
            this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
              ' 23:59:59'
          )
        : '',
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxplt/sys/msg/list/searches', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/msg/save`, params);
  }

  public updateState(params: Udata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/msg/status/update`, params);
  }

  public info(params: Idata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/msg/detail/search`, params);
  }
}
