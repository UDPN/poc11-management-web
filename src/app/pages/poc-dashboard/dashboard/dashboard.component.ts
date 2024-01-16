import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyService } from '@app/core/services/common/destory.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocDashBoardService } from '@app/core/services/http/poc-dashboard/poc-dashboard.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { timestampToDate } from '@app/utils/tools';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  bankNumberList: any = [];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisHeight: number = 100;
  yAxisWidth: number = 100;
  xAxisLabel2: string = '';
  yAxisLabel2: string = '';
  xAxisLabel1: string = '';
  yAxisLabel1: string = '';
  timeline: boolean = true;
  multi2: any[] = [];
  multi1: any[] = [];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  testSeries: any[] = [];
  view: [number, number] = [1200, 400];
  volumeForm!: FormGroup;
  rateForm!: FormGroup;
  centralBankList: any = [];
  commercialBankList: any = [];
  bankInfoList: any = [];
  getScreenWidth: any;
  colorScheme: Color = {
    domain: ['#5AA454', '#E44D25', '#7aa3e5', '#a8385d', '#aae3f5'],
    name: '',
    selectable: false,
    group: ScaleType.Linear
  };
  rateCommercialBankList: any = [];
  rateCurrencyList: any = [];
  listParam: any = {
    sourceCurrency: '',
    sourcePlatform: '',
    targetCurrency: '',
    targetPlatform: ''
  };
  volumeParam: any = {
    centralBankCode: '',
    commercialBankCode: ''
  };
  constructor(private fb: FormBuilder, private commonService: CommonService, private dataService: LoginService, private destroy$: DestroyService, private router: Router, private pocDashBoardService: PocDashBoardService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.centralBankChange();
    this.rateCommercialBankChange();
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Dashboard'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  // @HostListener('window:resize', ['$event'])
  ngOnInit() {
    this.volumeForm = this.fb.group({
      centralBankCode: [''],
      commercialBankCode: [''],
    });
    this.rateForm = this.fb.group({
      spCode: [''],
      currency: [''],
    });
    this.getBankNumber();
    this.getBankInfo();
    this.getVolumeSelectBank();
    this.getRateCommercialBank();
    this.onQueryVolume();
    this.onQueryRate();
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth > 900) {
      this.legend = true;
      this.view = [this.getScreenWidth - 400, 400];
    } else if (this.getScreenWidth > 500 && this.getScreenWidth < 900) {
      this.legend = false;
      this.view = [this.getScreenWidth - 200, 400];
    } else {
      this.legend = false;
      this.view = [300, 300];
    }
  }

  getBankNumber() {
    this.pocDashBoardService.getBankNumber().subscribe((res: any) => {
      if (res) {
        this.bankNumberList = res;
        this.cdr.markForCheck();
      }
    });
  }

  getBankInfo() {
    this.pocDashBoardService.getBankInfo().subscribe((res: any) => {
      if (res) {
        this.bankInfoList = res;
        console.log(this.bankInfoList);
        
        this.cdr.markForCheck();
      }
    });
  }

  getVolumeSelectBank() {
    this.pocDashBoardService.getVolumeSelectBank().subscribe((res: any) => {
      if (res) {
        this.centralBankList = res;
        this.cdr.markForCheck();
      }
    });
  }

  getRateCommercialBank() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_sp_bank_info', csePCode: 'FXPLT_SP_BANK_VAILD' }).subscribe((res: any) => {
      if (res) {
        this.rateCommercialBankList = res.dataInfo;
        console.log(this.rateCommercialBankList);
        
        this.cdr.markForCheck();
      }
    });
  }

  getRateCurrency(currencyCode: any) {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_linked_exchange_rate_pair', csePCode: currencyCode }).subscribe((res: any) => {
      if (res) {
        this.rateCurrencyList = res.dataInfo;
        if (this.rateCurrencyList && this.rateCurrencyList.length > 0) {
          this.rateCurrencyList.map((item: any, i: any) => {
            Object.assign(item, { key: i + 1 });
          });
          this.listParam = {
            sourceCurrency: this.rateCurrencyList[0]?.sourceCurrency,
            sourcePlatform: this.rateCurrencyList[0]?.sourcePlatform,
            targetCurrency: this.rateCurrencyList[0]?.targetCurrency,
            targetPlatform: this.rateCurrencyList[0]?.targetPlatform
          };
          this.rateForm.get('currency')?.setValue(1);
        } else {
          this.listParam.sourceCurrency = '';
          this.listParam.sourcePlatform = '';
          this.listParam.targetCurrency = '';
          this.listParam.targetPlatform = '';
        };
        this.cdr.markForCheck();
      }
    });
  }

  rateCommercialBankChange() {
    this.rateForm.get('spCode')?.valueChanges.subscribe(res => {
      this.rateForm.get('currency')?.setValue(0);
      this.getRateCurrency(res);
    })
  }

  centralBankChange() {
    this.volumeForm.get('centralBankCode')?.valueChanges.subscribe(res => {
      this.volumeForm.get('commercialBankCode')?.setValue('');
      this.centralBankList.forEach((item: any) => {
        if (res === item.centralBankCode) {
          this.commercialBankList = item.outCommercialInfos;
          this.cdr.markForCheck();
        }
      });
    })
  }

  onQueryVolume() {
    this.pocDashBoardService.getVolumeChart(this.volumeForm.value).subscribe((res: any) => {
      if (res) {
        let multi1: any = [];
        if (res.length > 0) {
          res.forEach((item: any) => {
            let series1: any = [];
            item.transactionStatistics.forEach((items: any) => {
              series1.push({
                name:
                  items.fromCurrency +
                  '->' +
                  items.toCurrency,
                value: items.transactionNumber
                  .toString()
                  .replace(/\d{1,3}(?=(\d{3})+(\.|$))/gy, '$&,')
              });
            });
            multi1.push({
              name: timestampToDate(item.transactionDate),
              series: series1
            });
            this.testSeries = series1;
            this.multi1 = multi1;
            Object.assign(this, { multi1 });
          });
        } else {
          this.multi1 = multi1;
          Object.assign(this, { multi1 });
        }
      }
      this.cdr.markForCheck();
    });
  }

  onQueryRate() {
    this.rateCurrencyList.map((item: any) => {
      if (this.rateForm.get('currency')?.value === item.key) {
        this.listParam.sourceCurrency = item.sourceCurrency;
        this.listParam.sourcePlatform = item.sourcePlatform;
        this.listParam.targetCurrency = item.targetCurrency;
        this.listParam.targetPlatform = item.targetPlatform;
      }
    });
    const params = {
      spCode: this.rateForm.get('spCode')?.value || '',
      sourceCurrency: this.listParam.sourceCurrency || '',
      sourcePlatform: this.listParam.sourcePlatform || '',
      targetCurrency: this.listParam.targetCurrency || '',
      targetPlatform: this.listParam.targetPlatform || ''
    };
    this.pocDashBoardService
      .getRateChart(params)
      .subscribe((res) => {
        if (res) {
          let multi: any = [];

          if (res.length > 0) {
            res.forEach((item: any) => {
              let series: any = [];
              item.historyExchangeRateInfoList.forEach((items: any) => {
                series.push({
                  name: timestampToDate(items.date),
                  value: items.exchangeRate
                    .toString()
                    .replace(/\d{1,3}(?=(\d{3})+(\.|$))/gy, '$&,')
                });
              });
              multi.push({
                name:
                  item.sourceCurrency +
                  '->' +
                  item.targetCurrency,
                series: series
              });
              this.multi2 = multi;
              Object.assign(this, { multi });
            });
          } else {
            this.multi2 = multi;
            Object.assign(this, { multi });
          }
        }
        this.cdr.markForCheck();
      });
  }

}
