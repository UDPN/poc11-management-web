/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-25 13:30:21
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-25 19:31:22
 * @Description: 
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: BaseHttpService, private https: HttpClient) { }
  public getSelect(params: { dropDownTypeCode: any, csePCode?: any }): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/common/drop/down/box/searches`, params);
  }

  public getBnId(): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/commercial/bank/manage/authorized/bn/select`, {});
  }

  public upload(Request: any): Observable<any> {
    let file: File = Request;
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`/v1/fxplt/sys/file/upload`, formData);
  }

  public download(params: { hash: string}): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/file/download`, params);
  }
  public downloadEx(params: { hash: string}): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/file/extension/download`, params);
  }
}

