/*
 * @Author: chenyuting
 * @Date: 2025-02-14 11:26:03
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-20 10:21:42
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { TokenPairService } from '@app/core/services/http/poc-foreign-exchange/token-pair/token-pair.service';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit, AfterViewInit {
  validateForm!: FormGroup;
  allChecked: boolean = false;
  indeterminate: boolean = false;
  isLoading: boolean = false;
  tokenPairList: any = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private tokenPairService: TokenPairService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `New`,
      breadcrumbs: [
        {
          name: 'FX Management'
        },
        {
          name: 'Token Pair Management',
          url: '/poc/poc-foreign-exchange/token-pair'
        },
        { name: 'New' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      tokenPair: [this.tokenPairList, [Validators.required]]
    });
    this.getTokenPairList();
  }

  getTokenPairList() {
    this.tokenPairService.getCreateTokenPairList().subscribe((res: any) => {
      if (res) {
        res.map((item: any) => {
          this.tokenPairList.push({
            label: item.fromCurrency + '/' + item.toCurrency,
            value: item.fromCurrency + '/' + item.toCurrency,
            checked: false
          });
        });
      }
      this.validateForm.get('tokenPair')?.setValue(this.tokenPairList);
    });
  }

  updateAllChecked(event: any): void {
    this.indeterminate = false;
    if (event) {
      this.tokenPairList = this.tokenPairList.map((item: any) => ({
        ...item,
        checked: true
      }));
    } else {
      this.tokenPairList = this.tokenPairList.map((item: any) => ({
        ...item,
        checked: false
      }));
    }
    this.validateForm.get('tokenPair')?.setValue(this.tokenPairList);
  }
  updateSingleChecked(): void {
    if (this.tokenPairList.every((item: any) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.tokenPairList.every((item: any) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  onBack() {
    this.location.back();
  }

  onSubmit() {
    const params: any = [];
    const array = this.validateForm.get('tokenPair')?.value;
    array.map((item: any) => {
      if (item.checked === true) {
        params.push({
          fromPlatform: 'UDPN',
          fromCurrency: item.value.split('/')[0],
          toPlatform: 'UDPN',
          toCurrency: item.value.split('/')[1]
        });
      }
    });
    this.isLoading = true;
    this.tokenPairService
      .save(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success('Add successfully!', { nzDuration: 1000 })
              .onClose.subscribe(() => {
                this.validateForm.reset();
                this.location.back();
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
