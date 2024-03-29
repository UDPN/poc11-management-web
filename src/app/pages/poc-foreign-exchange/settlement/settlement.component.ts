import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { SettlementService } from '@app/core/services/http/poc-foreign-exchange/settlement/settlement.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  spId: string;
  settlementModelCode: string;
  settlementModelName: string;
  chargingModel: string;
  pairedExchangeRate: string;
  bic: any;
}

interface ListParam {
  spCode: string;
  spName: string;
  formRatePlatform: string;
  formRateCurrency: string;
  toRatePlatform: string;
  toRateCurrency: string;
}

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.less'],
})
export class SettlementComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('spTpl', { static: true })
  spTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('pairedTpl', { static: true })
  pairedTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    spId: '',
    chargingModel: '',
    settlementModelCode: '',
    settlementModelName: '',
    pairedExchangeRate: '',
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
  spIdList: any = [];
  pairedExchangeRateList: any = [];
  pairedValue: any = '';
  chargingModelList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  constructor(private settlementService: SettlementService, private commonService: CommonService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Foreign Exchange Management', 'Settlement Model Query'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable()
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
    this.searchParam.spId = '',
      this.searchParam.pairedExchangeRate = '',
      this.searchParam.chargingModel = '',
      this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_exchange_rate_info' }).subscribe((res) => {
      this.pairedExchangeRateList = res.dataInfo;
      this.pairedExchangeRateList.map((item: any, i: any) => {
        Object.assign(item, { key: i + 1 })
      })
      this.cdr.markForCheck();
    })
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_sp_bank_info', csePCode: 'FXPLT_SP_BANK_VAILD' }).subscribe((res) => {
      this.spIdList = res.dataInfo;
      this.spIdList.map((item: any, i: any) => {
        Object.assign(item, { spKey: i + 1 })
      })
      this.cdr.markForCheck();
    })
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'FXPLT_CHARGING_MODEL' }).subscribe((res) => {
      this.chargingModelList = res.dataInfo;
      this.cdr.markForCheck();
    })
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.pairedExchangeRateList.map((item: any) => {
      if (this.searchParam.pairedExchangeRate === item.key) {
        this.listParam.formRatePlatform = item.sourcePlatform,
          this.listParam.formRateCurrency = item.sourceCurrency,
          this.listParam.toRatePlatform = item.targetPlatform,
          this.listParam.toRateCurrency = item.targetCurrency
      } else if (this.searchParam.pairedExchangeRate === '') {
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
      } else if (this.searchParam.spId === '') {
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
        formRatePlatform: this.listParam.formRatePlatform,
        formRateCurrency: this.listParam.formRateCurrency,
        toRatePlatform: this.listParam.toRatePlatform,
        toRateCurrency: this.listParam.toRateCurrency,
        settlementModelCode: this.searchParam.settlementModelCode,
        settlementModelName: this.searchParam.settlementModelName,
        chargingModel: this.searchParam.chargingModel,
        bic: this.searchParam.bic
      }
    };
    this.settlementService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
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
        {
          title: 'FX SP',
          field: 'spName',
          width: 150
        },
        {
          title: 'BIC',
          field: 'bankBic',
          width: 200
        },
        // {
        //   title: 'Model Code',
        //   field: 'settlementModelCode',
        //   width: 280
        // },
        {
          title: 'Model Name',
          field: 'settlementModelName',
          width: 250
        },
        {
          title: 'Currency Pair',
          tdTemplate: this.pairedTpl,
          width: 180
        },
        {
          title: 'Charging Model',
          field: 'chargingModel',
          pipe: 'chargingModel',
          width: 200
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
