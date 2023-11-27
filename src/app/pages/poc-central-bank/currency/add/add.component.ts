import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm } from '@app/utils/tools';
import { finalize } from 'rxjs';
import { PocCurrencyService } from '@app/core/services/http/poc-currency/poc-currency.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  info: any = {};
  isLoading: boolean = false;
  tempStatus: boolean = true;
  constructor(private fb: FormBuilder, public routeInfo: ActivatedRoute, private message: NzMessageService, private pocCurrencyService: PocCurrencyService, private cdr: ChangeDetectorRef, private location: Location) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: this.tempStatus === true ? 'Create' : 'Edit',
      breadcrumbs: [
        { name: 'Central Bank Management'},
        { name: 'Currency Management', url: '/poc/poc-central-bank/currency' },
        { name: this.tempStatus === true ? 'Create' : 'Edit' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (JSON.stringify(params) !== '{}') {
        this.tempStatus = false;
        this.getInfo(params['currencyCode']);
      }
    })
    this.validateForm = this.fb.group({
      platform: [null, [Validators.required, this.validator]],
      currency: [null, [Validators.required, this.currencyValidator]],
      contractAddress: [null, [Validators.required, this.contractAddressValidator]],
      provider: [null, [Validators.required, this.validator]],
      currencyPrecision: [null, [Validators.required, this.currencyPrecisionValidator]]
    })
  }

  currencyValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^[A-Z]{2,50}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  validator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^.{2,100}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  contractAddressValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^[0][x][0-9a-fA-F]{40}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  currencyPrecisionValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^[1-9]\d*$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };


  getInfo(currencyCode: string): void {
    this.pocCurrencyService.getInfo({ currencyCode }).subscribe((res: any) => {
      this.info = res;
      this.validateForm.get('platform')?.setValue(res.platform);
      this.validateForm.get('currency')?.setValue(res.currency);
      this.validateForm.get('contractAddress')?.setValue(res.contractAddress);
      this.validateForm.get('provider')?.setValue(res.provider);
      this.validateForm.get('currencyPrecision')?.setValue(res.currencyPrecision);
      this.cdr.markForCheck();
      return;
    })
  }

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
    if (this.tempStatus === true) {
      this.pocCurrencyService.add(this.validateForm.value).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: res => {
          if (res) {
            this.message.success('Add successfully!',{ nzDuration: 1000}).onClose.subscribe(() => {
              this.validateForm.reset();
              this.location.back();
            });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    } else {
      const param = {
        currencyCode: this.info.currencyCode,
        contractAddress: this.validateForm.get('contractAddress')?.value,
        provider: this.validateForm.get('provider')?.value
      }
      this.pocCurrencyService.edit(param).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: res => {
          if (res) {
            this.message.success('Edit successfully!',{ nzDuration: 1000}).onClose.subscribe(() => {
              this.validateForm.reset();
              this.location.back();
            });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    }

  }

  onBack() {
    this.location.back();
  }

}
