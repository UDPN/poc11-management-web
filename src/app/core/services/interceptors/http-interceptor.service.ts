import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, map, TimeoutError } from 'rxjs';
import { catchError, filter, timeout } from 'rxjs/operators';

import { TokenKey } from '@config/constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WindowService } from '../common/window.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoginInOutService } from '../common/login-in-out.service';
import { environment } from '@env/environment';

interface CustomHttpConfig {
  headers?: HttpHeaders;
}
const APP_XHR_TIMEOUT = 60000;
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  reLoginCode: any = null;
  firstCode: any = null;
  errorCode: any = null;
  constructor(private windowServe: WindowService, public message: NzMessageService, private loginOutService: LoginInOutService, private modal: NzModalService, private translate: TranslateService, private router: Router) { }

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const token = this.windowServe.getSessionStorage(TokenKey);
    let httpConfig: CustomHttpConfig = {};
    if (!!token) {

    }
    req = req.clone({
      withCredentials: true
    });

    const copyReq = req.clone(httpConfig);
    return next.handle(this.performRequest(copyReq)).pipe(
      filter(e => e.type !== 0),
      map((res) => this.handleSuccess(res)),
      timeout(APP_XHR_TIMEOUT),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const status = error.status;
    if (error instanceof TimeoutError) {
      this.modal.error({
        nzTitle: "Error",
        nzContent: "the request has timed out !"
      });
    }
    let errMsg = '';
    if (status && status !== 200) {
      if (this.errorCode) {
        this.errorCode.close();
      }
      this.errorCode = this.modal.error({
        nzTitle: "Error",
        nzContent: "There is an error in backend system, please wait and try again in a few minutes.  If you encounter this issue all the time, please contract support."
      });
    }
    return throwError({
      code: status,
      message: errMsg
    });

    // let errMsg = '';
    // if (status === 0) {
    //   errMsg = 'An unknown error occurred network, please check your network';
    // }
    // if (status >= 300 && status < 400) {
    //   errMsg = `The request is server redirect, a status code ${status}`;
    // }
    // if (status >= 400 && status < 500) {
    //   errMsg = `Client error, may be send a wrong data, a status code ${status}`;
    // }
    // if (status >= 500) {

    //   errMsg = `Server error occurs, a status code ${status}`;
    // }
    // return throwError({
    //   code: status,
    //   message: errMsg
    // });

  }

  private handleSuccess(event: any): HttpResponse<any> {
    const filterCode = [0, '0', 200, 304];
    const otherFilterCode = ['FXPLT_ELEVEN_20223'];
    if (event instanceof HttpResponse) {
      if (event.url !== undefined && event.url !== null && event.url.indexOf('.json') !== -1) {
        return event;
      }
      if (event.status === 200 && event.body.hasOwnProperty('code')) {
        if (filterCode.includes(event.body.code)) {
          return event;
        }
        if (event.body.code !== 'FXPLT_ELEVEN_20602') {
          if (!this.firstCode) {
            this.modal.error({
              nzTitle: 'error',
              nzContent: this.translate.instant(`MSG_${event.body.code}`)
            })
          }
        } else {
          this.windowServe.clearStorage();
          this.windowServe.clearSessionStorage();
          this.loginOutService.loginOut().then(_ => {
            this.router.navigateByUrl('/login/login-modify');
            if (this.reLoginCode) {
              this.reLoginCode.close();
            }
            this.reLoginCode = this.modal.error({
              nzTitle: 'Login information expired, log in again',
              nzContent: '',
            });

          });
        }
        if (event.body.code === -1) {
          this.modal.error({
            nzTitle: "Error",
            nzContent: "System error, please try again later !"
          });
          return event;
        }
        if (event.body.code === 50000) {
          this.modal.error({
            nzTitle: "Error",
            nzContent: "Encounter an internal error, please contact VN admin with message code: 50000 !"
          });
          return event;
        }
        if (otherFilterCode.includes(event.body.code)) {
          this.modal.error({
            nzTitle: 'error',
            nzContent: this.translate.instant(`MSG_${event.body.code}`, { value: event.body.data })
          });
          return event;
        }
        // if (event.body.code === 20170 || event.body.code === 20171) {
        //   this.modal.error({
        //     nzTitle: 'error',
        //     nzContent: this.translate.instant(`MSG_${event.body.code}`, { value: event.body.data[0], value1: event.body.data[1] })
        //   })
        //   return event;
        // }
      }
    }
    return event;
  }
  private performRequest(req: HttpRequest<any>): HttpRequest<any> {
    const headers: HttpHeaders = req.headers;
    if (environment.production) {
      return req.clone({ url: `${environment.localUrl}${req.url}`, headers });
    } else {
      return req.clone({ url: `${req.url}`, headers });
    }
  }
}
