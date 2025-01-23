/*
 * @Author: chenyuting
 * @Date: 2025-01-17 13:42:35
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-23 17:31:26
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { PocWalletConfigurationrService } from '@app/core/services/http/poc-wallet-configuration/poc-wallet-configuration.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnCheckForm } from '@app/utils/tools';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-wallet-configuration',
  templateUrl: './wallet-configuration.component.html',
  styleUrls: ['./wallet-configuration.component.less']
})
export class WalletConfigurationComponent implements OnInit, AfterViewInit {
  validateForm!: FormGroup;
  isLoading: boolean = false;
  info: any = {};
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  constructor(
    private fb: FormBuilder,
    private walletConfigurationrService: PocWalletConfigurationrService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Wallet Configuration Management'],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.getInfo();
    this.validateForm = this.fb.group({
      masterSubWalletNumber: [
        null,
        [Validators.required, this.masterWalletNumberValidator]
      ],
      mainSubWalletNumber: [
        null,
        [Validators.required, this.mainWalletNumberValidator]
      ]
    });
  }

  getInfo() {
    this.walletConfigurationrService.info().subscribe((res: any) => {
      if (res) {
        this.info = res;
        this.validateForm
          .get('masterSubWalletNumber')
          ?.setValue(res.masterSubWalletNumber);
        this.validateForm
          .get('mainSubWalletNumber')
          ?.setValue(res.mainSubWalletNumber);
        this.cdr.markForCheck();
      }
    });
  }

  masterWalletNumberValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^[0-9]\d*$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  mainWalletNumberValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^[0-9]\d*$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
    if (JSON.stringify(this.info) === '{}') {
      this.walletConfigurationrService
        .add(this.validateForm.value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            if (res) {
              this.message
                .success('Add successfully!', { nzDuration: 1000 })
                .onClose.subscribe(() => {
                  this.getInfo();
                });
            }
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
    } else {
      const param = this.validateForm.value;
      param.walletConfigCode = this.info.walletConfigCode;
      this.walletConfigurationrService
        .edit(param)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            if (res) {
              this.message
                .success('Edit successfully!', { nzDuration: 1000 })
                .onClose.subscribe(() => {
                  this.getInfo();
                });
            }
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
    }
  }
}
