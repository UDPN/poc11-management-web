import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCommercialBankService } from '@app/core/services/http/poc-commercial-bank/poc-commercial-bank.service';
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
  commercialBankCode: string;
  commercialBankName: string;
  commercialBankIntroduction: string;
  bnCode: string;
  status: string;
  createTime: any;
}

@Component({
  selector: 'app-commercial-bank',
  templateUrl: './commercial-bank.component.html',
  styleUrls: ['./commercial-bank.component.less'],
})
export class CommercialBankComponent implements OnInit, AfterViewInit {
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
    status: ''
  };
  statusList: any = [];
  applicationTypeList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  constructor(private pocCommercialBankService: PocCommercialBankService, private commonService: CommonService, private message: NzMessageService, private cdr: ChangeDetectorRef, private modal: NzModalService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Commercial/Settlement Bank Management'],
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

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  resetForm(): void {
    this.searchParam = {};
    this.searchParam.createTime = [],
      this.searchParam.status = ''
    this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'BANK_APPLICATION_TYPE' }).subscribe((res) => {
      this.applicationTypeList = res.dataInfo;
    })

    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'BUSINESS_APPLICATION_STATUS' }).subscribe((res) => {
      this.statusList = res.dataInfo;
    })
  }

  getDataList(e?: NzTableQueryParams): void {
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<any> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.pocCommercialBankService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
    //   this.tableLoading(false);
    // })).subscribe((_: any) => {
    //   this.dataList = _.data;
    //   this.dataList.forEach((item: any, i: any) => {
    //     Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 })
    //   })
    //   this.tableConfig.total = _?.resultPageInfo?.total;
    //   this.tableConfig.pageIndex = params.pageNum;
    //   this.tableLoading(false);
    //   this.cdr.markForCheck();
    // });
  }

  onStatusUpdate(status: any, commercialBankCode: string): void {
    let statusValue = '';
    if (status === 1) {
      statusValue = 'inactivate';
    } else {
      statusValue = 'activate';
    }
    const toolStatus = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${statusValue} this bank ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.pocCommercialBankService.statusUpdate({ status, commercialBankCode }).subscribe({
            next: res => {
              resolve(true);
              this.cdr.markForCheck();
              if (res) {
                this.message.success(`${toolStatus} this bank successfully!`, { nzDuration: 1000 });
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
          field: 'commercialBankCode',
          width: 280
        },
        {
          title: 'Bank Name',
          field: 'commercialBankName',
          width: 180
        },
        {
          title: 'Application Type',
          field: '',
          width: 250
        },
        {
          title: 'Brief Introduction',
          field: 'commercialBankIntroduction',
          width: 220
        },
        {
          title: 'Application Time',
          field: 'createDate',
          pipe: 'timeStamp',
          width: 200
        },
        {
          title: 'Status',
          field: 'status',
          pipe: 'applicationStatus',
          width: 180
        },
        {
          title: 'Action',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 200
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
