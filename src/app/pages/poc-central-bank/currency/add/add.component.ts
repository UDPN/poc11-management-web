import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm } from '@app/utils/tools';
import { finalize } from 'rxjs';
import { CommonService } from '@app/core/services/http/common/common.service';
import { CurrencyService } from '@app/core/services/http/poc-central-bank/currency/currency.service';

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
  centralBankList: any = [];
  constructor(
    private fb: FormBuilder, 
    public routeInfo: ActivatedRoute, 
    private message: NzMessageService, 
    private currencyService: CurrencyService, 
    private cdr: ChangeDetectorRef, 
    private location: Location,
    private commonService: CommonService
  ) { }
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
    this.initSelect();
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (JSON.stringify(params) !== '{}') {
        this.tempStatus = false;
        this.getInfo(params['currencyCode']);
      }
    })
    this.validateForm = this.fb.group({
      currency: ['w-', [Validators.required]],
      contractAddress: [null, [Validators.required, this.contractAddressValidator]],
      centralBankCode: [null, [Validators.required]],
      currencyPrecision: [null, [Validators.required, this.currencyPrecisionValidator]]
    })
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_central_bank_info', csePCode: 'FXPLT_CENTRAL_BANK_VAILD' }).subscribe((res) => {
      this.centralBankList = res.dataInfo;
    })
  }

  // currencyValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
  //   if (!control.value) {
  //     return { error: true, required: true };
  //   } else if (!(/^[A-Z]{2,50}$/).test(control.value)) {
  //     return { regular: true, error: true };
  //   }
  //   return {};
  // };

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
    this.currencyService.getInfo({ currencyCode }).subscribe((res: any) => {
      this.info = res;
      this.validateForm.get('currency')?.setValue(res.currency);
      this.validateForm.get('contractAddress')?.setValue(res.contractAddress);
      this.validateForm.get('centralBankCode')?.setValue(res.centralBankCode);
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
      this.currencyService.add(this.validateForm.value).pipe(finalize(() => this.isLoading = false)).subscribe({
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
        contractAddress: this.validateForm.get('contractAddress')?.value
      }
      this.currencyService.edit(param).pipe(finalize(() => this.isLoading = false)).subscribe({
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
