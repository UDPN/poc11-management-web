/*
 * @Author: zhangxuefeng
 * @Date: 2024-02-02 15:53:46
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-07-08 17:02:13
 * @Description: 
 */
import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  spId: any,
  pairedExchangeRate: any,
  createTime: any
}

interface ListParam {
  spCode: string,
  spName: string,
  formRatePlatform: string,
  formRateCurrency: string,
  toRatePlatform: string,
  toRateCurrency: string,
}

@Component({
  selector: 'app-foreign-model',
  templateUrl: './foreign-model.component.html',
  styleUrls: ['./foreign-model.component.less'],
})
export class ForeignModelComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  selectType: any = '1';
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  typeList: any = [
    {
      title: 'Service Provider Published Rates',
      instruction: [
        'Admins can limit the spread and interval of rate updates', 
        'Commercial banks can select preferred rates or set parameters to receive the best rates among multiple providers.'
      ],
      value: '1'
    },
    {
      title: 'Daily Fixed Platform Rates',
      instruction: [
        'Daily/hourly fixed rates set by Custodian Bank /admin',
        'Manually set or automatically set through algorithms with rate sources'
      ],
      value: '2'
    },
    {
      title: 'Commercial Bank Asking Rates',
      instruction: [
        'Commercial banks submit their preferred rates, service providers bid on them'
      ],
      value: '3'
    }
  ];
  constructor(private cdr: ChangeDetectorRef, private modalService: NzModalService, private message: NzMessageService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['FX Rate Mechanism'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.selectType = sessionStorage.getItem('selectType') || '1';
  }

  onSubmit() {
    let value: string = '';
    let code: string = ''
    this.typeList.map((item: any) => {
      if (this.selectType === item.value) {
        value = item.title;
        code = item.value;
      }
    })
    this.modalService.confirm({
      nzTitle: `Are you sure to change the exchange rate mode to '${value}'?`,
      nzOnOk: () => {
        this.message.success(`Submit successfully`)
        sessionStorage.setItem('selectType', code);
      }
    })
  }


}
