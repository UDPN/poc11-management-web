import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { CurrencyService } from '@app/core/services/http/poc-central-bank/currency/currency.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  currencyCode: string;
  currency: string;
  status: string;
  contractAddress: string;
  centralBankCode: string;
  createTime: any;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.less'],
})
export class CurrencyComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    createTime: [],
    status: '',
    centralBankCode: ''
  };
  statusList: any = [];
  centralBankList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  constructor(private currencyService: CurrencyService, private commonService: CommonService, private modal: NzModalService, private cdr: ChangeDetectorRef, private message: NzMessageService,) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Central Bank/Custodian Bank Management', 'Currency Management'],
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
    this.searchParam.createTime = [];
    this.searchParam.status = '';
    this.searchParam.centralBankCode = '';
    this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'CENTRAL_BANK_MANAGEMENT_STATUS' }).subscribe((res) => {
      this.statusList = res.dataInfo;
    })

    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_central_bank_info' }).subscribe((res) => {
      this.centralBankList = res.dataInfo;
    })
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.currencyService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
      this.tableLoading(false);
    })).subscribe((_: any) => {
      this.dataList = _.data;
      this.tableConfig.total = _?.resultPageInfo?.total;
      this.tableConfig.pageIndex = params.pageNum;
      this.tableLoading(false);
      this.cdr.markForCheck();
    });
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
          this.currencyService.statusUpdate({ status, currencyCode }).subscribe({
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
          title: 'wCBDC',
          field: 'currency',
          width: 120
        },
        {
          title: 'wCBDC ID',
          field: 'currencyCode',
          width: 280
        },
        {
          title: 'Decimal Precision',
          field: 'precision',
          pipe: 'nullValue',
          width: 150
        },
        {
          title: 'Contract Address',
          field: 'contractAddress',
          width: 280
        },
        {
          title: 'Custodian Bank',
          field: 'centralBankName',
          width: 240
        },
        {
          title: 'Created On',
          field: 'createDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 160
        },
        {
          title: 'Status',
          field: 'status',
          pipe: 'commercialStatus',
          width: 100
        },
        // {
        //   title: 'Actions',
        //   tdTemplate: this.operationTpl,
        //   fixed: true,
        //   fixedDir: 'right',
        //   showAction: false,
        //   width: 160

        // },
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }
}
