/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-25 13:30:08
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-17 14:31:25
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

export interface Adata {
  masterSubWalletNumber: number;
  mainSubWalletNumber: number;
}

export interface Edata {
  masterSubWalletNumber: number;
  mainSubWalletNumber: number;
  walletConfigCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class PocWalletConfigurationrService {
  constructor(public http: BaseHttpService, private https: HttpClient) {}

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/wallet/config/save`, params);
  }

  public edit(params: Edata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/wallet/config/edit`, params);
  }

  public info(): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/wallet/config/search`, {});
  }
}
