import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCurrencyService } from '@app/core/services/http/poc-currency/poc-currency.service';
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
  bnCode: string;
  bankName: string;
  bnId: string;
  status: string;
  createTime: any;
}

@Component({
  selector: 'app-central-bank-regist',
  templateUrl: './central-bank-regist.component.html',
  styleUrls: ['./central-bank-regist.component.less'],
})
export class CentralBankRegistComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true }) currencyTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    createTime: [],
    status: ''
  };
  statusList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  constructor(private pocCurrencyService: PocCurrencyService, private commonService: CommonService, private modal: NzModalService, private cdr: ChangeDetectorRef, private message: NzMessageService,) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Central Bank Management', 'Central Bank Registration'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.initSelect();
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  resetForm(): void {
    this.searchParam = {};
    this.searchParam.createTime = [],
      this.searchParam.status = ''
    this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'FXPLT_COMMERCIAL_BANK_ REGISTRATION' }).subscribe((res) => {
      this.statusList = res.dataInfo;
    })
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<any> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.pocCurrencyService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
    //   this.tableLoading(false);
    // })).subscribe((_: any) => {
    //   this.dataList = _.data;
    //   this.tableConfig.total = _?.resultPageInfo?.total;
    //   this.tableConfig.pageIndex = params.pageNum;
    //   this.tableLoading(false);
    //   this.cdr.markForCheck();
    // });
  }

  onStatusUpdate(status: any, currencyCode: string): void {
    let statusValue = '';
    if (status === 1) {
      statusValue = 'inactivate';
    } else {
      statusValue = 'activate';
    }
    const toolStatus = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${statusValue} this currency ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.pocCurrencyService.statusUpdate({ status, currencyCode }).subscribe({
            next: res => {
              resolve(true);
              this.cdr.markForCheck();
              if (res) {
                this.message.success(`${toolStatus} this currency successfully!`, { nzDuration: 1000 });
              }
              this.getDataList();
            },
            error: err => {
              reject(true);
              this.cdr.markForCheck();
            },
          })
        }).catch(() => console.log('Oops errors!'))
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Bank ID',
          field: '',
          width: 280
        },
        {
          title: 'Bank Name',
          field: '',
          width: 150
        },
        {
          title: 'Brief Introduction',
          field: '',
          width: 300
        },
        {
          title: 'BN ID',
          field: '',
          width: 300
        },
        {
          title: 'Creation Time',
          field: 'createDate',
          pipe: 'timeStamp',
          width: 160
        },
        {
          title: 'Status',
          field: 'status',
          pipe: 'commercialStatus',
          width: 100
        },
        {
          title: 'Action',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 160

        },
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }
}
