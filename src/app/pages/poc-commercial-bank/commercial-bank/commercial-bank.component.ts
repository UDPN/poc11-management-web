import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCommercialBankService } from '@app/core/services/http/poc-commercial-bank/poc-commercial-bank.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  spChainCode: string;
  spName: string;
  bankType: any;
  centralBankChainId: any;
  bankBic: string;
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
    bankType: '',
    centralBankChainId: ''
  };
  centralBankList: any = [];
  typeList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  constructor(private pocCommercialBankService: PocCommercialBankService, private commonService: CommonService, private message: NzMessageService, private cdr: ChangeDetectorRef, private modal: NzModalService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Commercial Bank Query'],
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
    this.searchParam.centralBankChainId = '';
    this.searchParam.bankType = ''
    this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'FX_SP_STATUS' }).subscribe((res) => {
      this.typeList = res.dataInfo;
    })

    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_central_bank_info', csePCode: 'FXPLT_CENTRAL_BANK_VAILD' }).subscribe((res) => {
      this.centralBankList = res.dataInfo;
    })
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.pocCommercialBankService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
      this.tableLoading(false);
    })).subscribe((_: any) => {
      this.dataList = _.data;
      this.dataList.forEach((item: any, i: any) => {
        Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 })
      })
      this.tableConfig.total = _?.resultPageInfo?.total;
      this.tableConfig.pageIndex = params.pageNum;
      this.tableLoading(false);
      this.cdr.markForCheck();
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        // {
        //   title: 'Bank ID',
        //   field: 'spChainCode',
        //   width: 280
        // },
        {
          title: 'Commercial Bank',
          field: 'spName',
          width: 180
        },
        {
          title: 'BIC',
          field: 'bankBic',
          width: 180
        },
        {
          title: 'Central Bank',
          field: 'centralBankName',
          width: 200
        },
        {
          title: 'Bank Description',
          field: 'spBriefIntroduction',
          width: 350
        },
        {
          title: 'FX SP',
          field: 'bankType',
          pipe: 'bankTypeStatus',
          width: 180
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 150
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
