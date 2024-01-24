import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { BusinessActivationService } from '@app/core/services/http/poc-foreign-exchange/business-activation/business-activation.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  spCode: string;
  spName: string;
  currency: any,
  bic: any,
  pairedExchangeRate: any,
}

interface ListParam {
  applicationFormRatePlatform: string;
  applicationFormRateCurrency: string;
  applicationToRatePlatform: string;
  applicationToRateCurrency: string;
  platform: string;
  currency: string;
}

@Component({
  selector: 'app-business-activation',
  templateUrl: './business-activation.component.html',
  styleUrls: ['./business-activation.component.less'],
})
export class BusinessActivationComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTypeTpl', { static: true }) currencyTypeTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('foreignTpl', { static: true }) foreignTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    spCode: '',
    spName: '',
    currency: '',
    pairedExchangeRate: '',
    bic: '',
  };

  listParam: Partial<ListParam> = {
    applicationFormRatePlatform: '',
    applicationFormRateCurrency: '',
    applicationToRatePlatform: '',
    applicationToRateCurrency: '',
    platform: '',
    currency: '',
  };

  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  pairedExchangeRateList: any = [];
  currencyList: any = [];
  constructor(private businessActivationService: BusinessActivationService, private cdr: ChangeDetectorRef, private commonService: CommonService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Foreign Exchange Management', 'FX Activation Query'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.initSelect();
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_exchange_rate_info', csePCode: 'FXPLT_EXCHANGE_RATE_VAILD' }).subscribe((res) => {
      this.pairedExchangeRateList = res.dataInfo;
      this.pairedExchangeRateList.map((item: any, i: any) => {
        Object.assign(item, { key: i + 1 })
      })
      this.cdr.markForCheck();
    })
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_currency_status_info' }).subscribe((res) => {
      this.currencyList = res.dataInfo;
      this.currencyList.map((item: any, i: any) => {
        Object.assign(item, { currencyKey: i + 1 })
      })
      this.cdr.markForCheck();
    })
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
    this.searchParam.pairedExchangeRate = '';
    this.searchParam.currency = '';
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.pairedExchangeRateList.map((item: any) => {
      if (this.searchParam.pairedExchangeRate === item.key) {
        this.listParam.applicationFormRatePlatform = item.sourcePlatform,
          this.listParam.applicationFormRateCurrency = item.sourceCurrency,
          this.listParam.applicationToRatePlatform = item.targetPlatform,
          this.listParam.applicationToRateCurrency = item.targetCurrency
      } else if (this.searchParam.pairedExchangeRate === '') {
        this.listParam.applicationFormRatePlatform = '',
          this.listParam.applicationFormRateCurrency = '',
          this.listParam.applicationToRatePlatform = '',
          this.listParam.applicationToRateCurrency = ''
      }
    })
    this.currencyList.map((item: any) => {
      if (this.searchParam.currency === item.currencyKey) {
        this.listParam.platform = item.platform,
          this.listParam.currency = item.currency
      } else if (this.searchParam.currency === '') {
        this.listParam.platform = '',
          this.listParam.currency = ''
      }
    })
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        spCode: this.searchParam.spCode,
        spName: this.searchParam.spName,
        applicationFormRatePlatform: this.listParam.applicationFormRatePlatform,
        applicationFormRateCurrency: this.listParam.applicationFormRateCurrency,
        applicationToRatePlatform: this.listParam.applicationToRatePlatform,
        applicationToRateCurrency: this.listParam.applicationToRateCurrency,
        platform: this.listParam.platform,
        currency: this.listParam.currency,
        bic: this.searchParam.bic
      }
    };
    this.businessActivationService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
      this.tableLoading(false);
    })).subscribe((_: any) => {
      this.dataList = _.data;
      this.dataList.map((item: any) => {
        item.outCapitalPoolActivation = item.outCapitalPoolActivation ? item.outCapitalPoolActivation.toString().split(',') : '';
        item.outActivationRate = item.outActivationRate ? item.outActivationRate.toString().split(','): '';
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
        //   title: 'FX SP ID',
        //   field: 'spCode',
        //   width: 220
        // },
        {
          title: 'FX SP Name',
          field: 'spName',
          width: 220
        },
        {
          title: 'BIC',
          field: 'bankBic',
          width: 220
        },
        {
          title: 'Currency',
          tdTemplate: this.currencyTypeTpl,
          width: 300
        },
        {
          title: 'Currency Pair',
          tdTemplate: this.foreignTpl,
          width: 260
        },
        // {
        //   title: 'Application No.',
        //   field: 'businessApplicationCode',
        //   width: 220
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
