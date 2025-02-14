/*
 * @Author: chenyuting
 * @Date: 2025-02-14 11:26:03
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-14 15:00:46
 * @Description:
 */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';

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
  tokenPairList = [
    { label: '1', value: '1', checked: false },
    { label: '2', value: '2', checked: false },
    { label: '3', value: '3', checked: false },
    { label: '4', value: '4', checked: false }
  ];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(private fb: FormBuilder, private location: Location) {}
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
  }

  updateAllChecked(event: any): void {
    this.indeterminate = false;
    if (event) {
      this.tokenPairList = this.tokenPairList.map((item) => ({
        ...item,
        checked: true
      }));
    } else {
      this.tokenPairList = this.tokenPairList.map((item) => ({
        ...item,
        checked: false
      }));
    }
    this.validateForm.get('tokenPair')?.setValue(this.tokenPairList);
  }
  updateSingleChecked(): void {
    if (this.tokenPairList.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.tokenPairList.every((item) => item.checked)) {
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
        params.push(item.value);
      }
    });
    console.log(params);
  }
}
