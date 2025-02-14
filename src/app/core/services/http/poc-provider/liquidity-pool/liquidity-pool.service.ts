/*
 * @Author: chenyuting
 * @Date: 2025-02-13 14:14:37
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 14:16:14
 * @Description:
 */
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LiquidityPoolService {
  constructor(
    private http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}
}
