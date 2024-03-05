/*
 * @Author: chenyuting 89172243+chenyuting12@users.noreply.github.com
 * @Date: 2024-01-23 15:56:27
 * @LastEditors: chenyuting 89172243+chenyuting12@users.noreply.github.com
 * @LastEditTime: 2024-03-04 14:05:22
 * @FilePath: \poc11-management-web\src\app\pages\poc-foreign-exchange\exchange-rate\exchange-rate.component.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { ExchangeRateService } from '@app/core/services/http/poc-foreign-exchange/exchange-rate/exchange-rate.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  spId: any;
  pairedExchangeRate: any;
  createTime: any;
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
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.less'],
})
export class ExchangeRateComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('spTpl', { static: true }) spTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('pairedTpl', { static: true }) pairedTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    spId: '',
    pairedExchangeRate: '',
    createTime: [],
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
  pairedExchangeRateList: any = [];
  spIdList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  constructor(private exchangeRateService: ExchangeRateService, private commonService: CommonService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Foreign Exchange Management', 'Exchange Rate Query'],
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
    this.listParam = {};
    this.searchParam.spId = '',
      this.searchParam.pairedExchangeRate = '',
      this.searchParam.createTime = [],
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
        createTime: this.searchParam.createTime,
        bic: this.searchParam.bic,
      }
    };
    this.exchangeRateService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
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
          title: 'FX SP',
          field: 'spName',
          // tdTemplate: this.spTpl,
          pipe: 'nullValue',
          width: 200
        },
        {
          title: 'BIC',
          field: 'bankBic',
          width: 200
        },
        {
          title: 'Currency Pair',
          tdTemplate: this.pairedTpl,
          width: 180
        },
        {
          title: 'FX Rate',
          field: 'exchangeRate',
          pipe: 'toThousandRate',
          width: 180
        },
        {
          title: 'Created On',
          field: 'rateDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
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
