import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';

export interface Adata {
  lockable: string;
  description: string;
  roleName: string;
  rsucIdList: any;
}

export interface Edata {
  roleCode: string;
  lockable: string;
  description: string;
  roleName: string;
  rsucIdList: any;
}

export interface Sdata {
  roleCode: string;
  lockable: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(public http: BaseHttpService, private https: HttpClient) { }
  list(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      roleName: filters.roleName || ''
    };
    return this.https.post('/v1/fxplt/sys/role/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/role/manage/save`, params);
  }

  public edit(params: Edata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/role/manage/edit`, params);
  }

  public info(params: { roleCode: string }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/role/manage/edit/detail/search`, params);
  }

  public statusUpdate(params: Sdata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/role/manage/status/update`, params);
  }

  // public roleList(): Observable<any> {
  //   return this.http.post(`/v1/fxplt/sys/role/manage/catch/resource/searches`, {});
  // }

  public treeList(): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/resource/manage/all/searches`, {});
  }
}
