/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:32:33
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-11 13:36:37
 * @Description:
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';

export interface Sdata {
  centralBankId: number;
  minimumBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class LiquidityPoolSettingService {
  constructor(private http: BaseHttpService) {}

  public getSearchToken(): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/liquidity/capital/pool/search`, {});
  }

  public save(params: Sdata): Observable<any> {
    return this.http.post(`/v1/fxplt/sys/liquidity/capital/pool/save`, params);
  }
}
