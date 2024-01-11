import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';

export interface Pages {
  pageNum: number,
  pageSize: number
}

export interface InPages {
  inPage: Pages
}
@Injectable({
  providedIn: 'root'
})
export class PocHomeService {

  constructor(private http: BaseHttpService, private https: HttpClient) { }
  public getList(
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const data: any = {
        pageSize: pageSize,
        pageNum: pageIndex
    };
    return this.https.post(`/v1/fxplt/sys/home/searches`, data);
  }
}
