import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

/*
 * @Author: chenyuting
 * @Date: 2025-02-13 14:19:48
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 14:20:00
 * @Description:
 */
@Injectable({
  providedIn: 'root'
})
export class TokenPairService {
  constructor(
    private http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}
}
