import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocFxTransactionsService } from '@app/core/services/http/poc-fx-transactions/poc-fx-transactions.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  spId: string;
  fromBnId: string;
  transactionNo: string;
  creation: any;
  currency: any;
  transactionHash: any;
  fromBankId: string;
  fromBankName: string;
  bic: string;
  toBankName: string;
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
  selector: 'app-fx-transactions',
  templateUrl: './fx-transactions.component.html',
  styleUrls: ['./fx-transactions.component.less'],
})
export class FxTransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('spTpl', { static: true }) spTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true }) amountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<NzSafeAny>; 
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    creation: [],
    currency: '',
    spId: '',
    fromBnId: '',
    transactionNo: '',
    transactionHash: '',
    fromBankId: '',
    fromBankName: '',
    toBankName: '',
    bic: ''
  };
  listParam: Partial<ListParam> = {
    spCode: '',
    spName: '',
    formRatePlatform: '',
    formRateCurrency: '',
    toRatePlatform: '',
    toRateCurrency: ''
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  currencyList: any = [];
  spIdList: any = [];
  bnIdList: any = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  constructor(private pocFxTransactionsService: PocFxTransactionsService, private commonService: CommonService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Foreign Exchange Management', 'FX Transactions'],
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
    this.listParam = {};
    this.searchParam.creation = [],
    this.searchParam.currency = '',
    this.searchParam.spId = '',
    this.searchParam.fromBnId = ''
    this.getDataList(this.tableQueryParams);
  }
  
  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_exchange_rate_info' }).subscribe((res) => {
      this.currencyList = res.dataInfo;
      this.currencyList.map((item: any, i: any) => {
        Object.assign(item, { key: i + 1 })
      })
      this.cdr.markForCheck();
    })

    this.commonService.getBnId().subscribe((res) => {
      this.bnIdList = res;
      this.cdr.markForCheck();
    })

    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_sp_bank_info', csePCode: 'FXPLT_SP_BANK_VAILD' }).subscribe((res) => {
      this.spIdList = res.dataInfo;
      this.spIdList.map((item: any, i: any) => {
        Object.assign(item, { spKey: i + 1 })
      })
      this.cdr.markForCheck();
    })
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.currencyList.map((item: any) => {
      if (this.searchParam.currency === item.key) {
        this.listParam.formRatePlatform = item.sourcePlatform,
        this.listParam.formRateCurrency = item.sourceCurrency,
        this.listParam.toRatePlatform = item.targetPlatform,
        this.listParam.toRateCurrency = item.targetCurrency
      } else if (this.searchParam.currency === '') {
        this.listParam.formRatePlatform = '',
        this.listParam.formRateCurrency = '',
        this.listParam.toRatePlatform = '',
        this.listParam.toRateCurrency = ''
      }
    })
    this.spIdList.map((item: any) => {
      if (this.searchParam.spId === item.spKey) {
        this.listParam.spCode = item.spChainCode,
        this.listParam.spName = item.spName
      } else if (this.searchParam.spId === ''){
        this.listParam.spCode = '',
        this.listParam.spName = ''
      }    
    })
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        spCode: this.listParam.spCode,
        spName: this.listParam.spName,
        transactionNo: this.searchParam.transactionNo,
        formPlatform: this.listParam.formRatePlatform,
        formCurrency: this.listParam.formRateCurrency,
        toPlatform: this.listParam.toRatePlatform,
        toCurrency: this.listParam.toRateCurrency,
        fromBankName: this.searchParam.fromBankName,
        toBankName: this.searchParam.toBankName,
        fromBankId: this.searchParam.fromBankId,
        creation: this.searchParam.creation,
        fromBnId: this.searchParam.fromBnId,
        transactionHash: this.searchParam.transactionHash,
        bankBic: this.searchParam.bic
      }
    };
    this.pocFxTransactionsService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
      this.tableLoading(false);
    })).subscribe((_: any) => {
      this.dataList = _.data;
      this.tableConfig.total = _?.resultPageInfo?.total;
      this.tableConfig.pageIndex = params.pageNum;
      this.tableLoading(false);
      this.cdr.markForCheck();
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Transaction No.',
          field: 'transactionNo',
          width: 200
        },
        {
          title: 'Commercial Bank Name',
          field: 'fromBankName',
          pipe: 'nullValue',
          width: 200
        },
        {
          title: 'Receiving Bank Name',
          field: 'toBankName',
          pipe: 'nullValue',
          width: 200
        },
        {
          title: 'FX SP Name',
          field: 'spName',
          width: 150
        },
        {
          title: 'BN ID',
          field: 'fromBnId',
          pipe: 'nullValue',
          width: 120
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
          width: 200
        },
        {
          title: 'Date',
          field: 'transactionDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Status',
          field: 'status',
          pipe: 'transactionsStatus',
          width: 120
        },
        {
          title: 'Action',
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
