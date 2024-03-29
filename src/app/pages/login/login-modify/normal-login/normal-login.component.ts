import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';

import { TokenKey, TokenKeyDefault, TokenPre, aesKey, aesVi } from '@config/constant';
import { DestroyService } from '@core/services/common/destory.service';
import { WindowService } from '@core/services/common/window.service';
import { LoginService } from '@services/login/login.service';
import { Login1StoreService } from '@store/biz-store-service/other-login/login1-store.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { LoginType } from '../login-modify.component';
import { fnCheckForm, fnEncrypts, fnRandomString } from '@app/utils/tools';
import { LoginInOutService } from '@app/core/services/common/login-in-out.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '@env/environment';
import sign from 'jwt-encode';


@Component({
  selector: 'app-normal-login',
  templateUrl: './normal-login.component.html',
  styleUrls: ['./normal-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class NormalLoginComponent implements OnInit {
  validateForm!: FormGroup;
  passwordVisible = false;
  password?: string;
  typeEnum = LoginType;
  isOverModel = false;
  srcUrl: any;
  instance!: string;
  hasUser!: boolean;
  version: any;
  isLoadingName: boolean = true;
  constructor(
    private destroy$: DestroyService,
    private userInfoService: UserInfoService,
    private router: Router,
    private loginInOutService: LoginInOutService,
    private menuService: MenuStoreService,
    private dataService: LoginService,
    private windowServe: WindowService,
    private spinService: SpinService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private login1StoreService: Login1StoreService,
    private message: NzMessageService
  ) { }

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.spinService.setCurrentGlobalSpinStore(true);
    this.validateForm.get('keySuffix')?.setValue(this.srcUrl.substring(this.srcUrl.indexOf("keySuffix=") + 10));
    const param = this.validateForm.getRawValue();
    const code = fnEncrypts(param, aesKey, aesVi);
    this.dataService.login({ code }).pipe(
      finalize(() => {
        this.spinService.setCurrentGlobalSpinStore(false);
      })
    ).subscribe(result => {
      if (result) {
        sessionStorage.setItem('clientName', result.realName);
        let dataFromat: any = {
          aud: [],
          user_name: {
            resourceList: result.userResourceList ? result.userResourceList : [],
            clientId: 1,
          },
          scope: [],
          exp: 1676862164,
          authorities: [],
          jti: '',
          client_id: '',
        };
        let secret = 'bejson';
        let tokens = sign(dataFromat, secret);
        this.loginInOutService.loginIn(tokens).then(() => {
          this.message
            .success('Login successfully!', { nzDuration: 1000 })
            .onClose!.subscribe(() => {
              this.router.navigateByUrl('/poc/poc-dashboard/dashboard');
            });
        });
      } else {
        this.onRefresh();
      }
    })
  }

  goOtherWay(type: LoginType): void {
    this.login1StoreService.setLoginTypeStore(type);
  }

  ngOnInit(): void {
    this.onRefresh();
    this.login1StoreService
      .getIsLogin1OverModelStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.isOverModel = res;
        this.cdr.markForCheck();
      });
    this.validateForm = this.fb.group({
      clientName: [environment.clientName ? environment.clientName : '', [Validators.required]],
      pwd: [environment.password ? environment.password : '', [Validators.required, this.pwdValidator]],
      captchaCode: ['', [Validators.required]],
      keySuffix: ['']
    });
  }

  pwdValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  onRefresh(): void {
    const url = environment.localUrl +
      '/v1/fxplt/anon/generate/captcha?' +
      fnRandomString(8, '');
    this.dataService.getCaptcha(url).subscribe(resp => {
      const data = JSON.parse(resp.body);
      this.srcUrl = 'data:image/jpg;base64,' + data.data.baseStr;
      let randomstr = resp.headers.get('Randomstr');
      let ss = resp.headers.get('Randomcode');
      if (randomstr) {
        this.validateForm.get('captchaCode')?.setValue(ss);
      }
    })
    this.cdr.markForCheck();
  }

}
