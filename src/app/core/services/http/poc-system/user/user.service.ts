/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-25 13:30:08
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-25 14:24:16
 * @Description: 
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';

export interface Adata {
  lockable: string;
  userName: string;
  telephone: string;
  roleIdList: any;
  email: string;
  realName: string;
  superUser: any;
}

export interface Edata {
  lockable: string;
  userName: string;
  telephone: string;
  roleIdList: any;
  email: string;
  realName: string;
  userId: string;
  superUser: any;
}

export interface Sdata {
  lockable: number;
  userId: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: BaseHttpService, private https: HttpClient) { }
  public list(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      userName: filters.userName || '',
      realName: filters.realName || '',
    };
    return this.https.post('/v1/fxplt/sys/user/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/user/manage/save`, params);
  }

  public edit(params: Edata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/user/manage/edit`, params);
  }

  public info(params: { userId: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/user/manage/edit/detail/search`, params);
  }

  public resetPassword(params: { userId: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/user/manage/password/reset`, params);
  }

  public statusUpdate(params: Sdata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/user/manage/status/update`, params);
  }

  public roleList(): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/role/manage/all/searches`, {});
  }


}
