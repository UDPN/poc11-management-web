/*
 * @Author: chenyuting
 * @Date: 2024-01-11 11:22:36
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-07-08 17:01:24
 * @Description:
 */
import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
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
import { thousandthMark, timestampToDate } from '@app/utils/tools';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import * as echarts from 'echarts';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, takeUntil } from 'rxjs';
import map from 'src/assets/map/map.json';
echarts.registerMap('map', map as any); /* 注册world地图 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyPairTpl', { static: true })
  currencyPairTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('centralBankTpl', { static: true })
  centralBankTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;

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
  maplist: any = [];
  mapBankInfo: any;
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
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  centralToolTip: any = [
    {
      currency: 'w-HKD',
      amount: 3000000
    },
    {
      currency: 'w-EUR',
      amount: 1120000
    },
    {
      currency: 'w-THB',
      amount: 8000000
    },
    {
      currency: 'w-THB',
      amount: 8000000
    }
  ];
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private dataService: LoginService,
    private destroy$: DestroyService,
    private router: Router,
    private pocDashBoardService: PocDashBoardService,
    private nzMessageService: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}
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
    // setTimeout(() => {
    //   this.getEcharts();
    // }, 300);
  }
  @HostListener('window:resize', ['$event'])
  ngOnInit() {
    this.initTable();
    this.volumeForm = this.fb.group({
      centralBankCode: [''],
      commercialBankCode: ['']
    });
    this.rateForm = this.fb.group({
      spCode: [''],
      currency: ['']
    });
    const fn = () => {
      const myChart: any = echarts.init(
        document.getElementById('chart-container')
      );
      myChart.resize();
    };
    window.addEventListener('resize', fn);

    this.getBankNumber();
    this.getBankInfo();
    this.getMap();
    this.getVolumeSelectBank();
    this.getRateCommercialBank();
    this.onQueryVolume();
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
  // --------------------------- //
  getEcharts(data: any) {
    const visualMapRange = [
      { min: 3, max: 3, color: '#204c7d', label: 'Central Bank/Custodian Bank ' },
      { min: 1, max: 2, color: '#ff0000', label: 'Commercial Bank' }
    ];
    var dom: any = document.getElementById('chart-container');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    // var data: any = [];
    // this.maplist.map((item: any) => {
    //   data.push({
    //     name:'' ,
    //     code: item.bankCode,
    //     value: [item.longitude, item.latitude, item.bankType]
    //   });
    // });
    var option;
    option = {
      backgroundColor: '#CEE3F5',
      geo: {
        show: true,
        roam: true,
        map: 'map',
        emphasis: {
          label: {
            show: true
          },
          itemStyle: {
            areaColor: '#CEE3F5'
          }
        },
        center: [0, 15],
        zoom: 1.2,
        scaleLimit: {
          min: 1.2,
          max: 40
        }
      },
      tooltip: {
        show: false,
        triggerOn: 'click',
        trigger: `item`,
        enterable: true
      },
      visualMap: {
        type: 'piecewise',
        min: 1,
        max: 3,
        calculable: true,
        inRange: {
          color: visualMapRange.map((item) => item.color)
        },
        pieces: visualMapRange.map((item) => ({
          min: item.min,
          max: item.max,
          label: item.label
        })),
        textStyle: {
          color: '#000'
        }
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          mapType: 'world',
          data: data,
          label: {
            show: true,
            formatter: (params: any) => {
              return params.data.name;
            },
            position: 'insideLeft',
            color: '#000'
          },
          tooltip: {
            show: true,
            extraCssText:
              'max-width:35%;max-height:60%;overflow: auto;overflow-x: hidden;padding:18px',
            formatter: (params: any, ticket: any, callback: Function) => {
              this.pocDashBoardService.getMapList().subscribe((res: any) => {
                if (res) {
                  const val = res.filter(
                    (item: any) => item.bankCode === params.data.code
                  );
                  this.mapBankInfo = val[0];
                  this.dataList =
                    this.mapBankInfo?.outCommercialBankInfoSearches;
                  if (val[0].bankLogoHash) {
                    this.commonService
                      .download({ hash: val[0].bankLogoHash })
                      .subscribe((data) => {
                        Object.assign(val[0], {
                          logo: 'data:image/jpg;base64,' + data
                        });
                        this.cdr.markForCheck();
                        this.cdr.detectChanges();
                        var container: any = document.getElementsByClassName(
                          'ss' + val[0].bankCode
                        );
                        callback(ticket, container[0].innerHTML);
                      });
                  }
                }
              });
              return 'Loading';
            }
          },
          symbolSize: 10,
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true
        }
      ]
    };
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }

  // ============================//

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  // getDataList(e?: NzTableQueryParams): void {
  //   this.tableConfig.loading = true;
  //   const params: SearchCommonVO<any> = {
  //     pageSize: this.tableConfig.pageSize!,
  //     pageNum: e?.pageIndex || this.tableConfig.pageIndex!
  //   };
  //   this.pocDashBoardService
  //     .getSpList(params.pageNum, params.pageSize)
  //     .pipe(
  //       finalize(() => {
  //         this.tableLoading(false);
  //       })
  //     )
  //     .subscribe((_: any) => {
  //       this.dataList = _.data;
  //       this.tableConfig.total = _?.resultPageInfo?.total;
  //       this.tableConfig.pageIndex = params.pageNum;
  //       this.tableLoading(false);
  //       this.cdr.markForCheck();
  //     });
  // }

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
        this.cdr.markForCheck();
      }
    });
  }

  getMap() {
    this.pocDashBoardService.getMapList().subscribe((res: any) => {
      if (res) {
        // this.maplist = res;
        var data: any = [];
        res.map((item: any) => {
          data.push({
            name: '',
            code: item.bankCode,
            value: [item.longitude, item.latitude, item.bankType]
          });
        });
        this.getEcharts(data);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
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
    this.commonService
      .getSelect({ dropDownTypeCode: 'drop_down_approved_sp_info' })
      .subscribe((res: any) => {
        if (res) {
          this.rateCommercialBankList = res.dataInfo;
          this.rateForm
            .get('spCode')
            ?.setValue(this.rateCommercialBankList[0].spChainCode);
          this.cdr.markForCheck();
        }
      });
  }

  getRateCurrency(currencyCode: any) {
    this.commonService
      .getSelect({
        dropDownTypeCode: 'drop_down_linked_exchange_rate_pair',
        csePCode: currencyCode
      })
      .subscribe((res: any) => {
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
          }
          this.onQueryRate();
          this.cdr.markForCheck();
        }
      });
  }

  rateCommercialBankChange() {
    this.rateForm.get('spCode')?.valueChanges.subscribe((res) => {
      this.rateForm.get('currency')?.setValue(0);
      this.getRateCurrency(res);
    });
  }

  centralBankChange() {
    this.volumeForm.get('centralBankCode')?.valueChanges.subscribe((res) => {
      this.volumeForm.get('commercialBankCode')?.setValue('');
      this.centralBankList.forEach((item: any) => {
        if (res === item.centralBankCode) {
          this.commercialBankList = item.outCommercialInfos;
          this.cdr.markForCheck();
        }
      });
    });
  }

  onQueryVolume() {
    this.pocDashBoardService
      .getVolumeChart(this.volumeForm.value)
      .subscribe((res: any) => {
        if (res) {
          let multi1: any = [];
          if (res.length > 0) {
            res.forEach((item: any) => {
              let series1: any = [];
              item.transactionStatistics.forEach((items: any) => {
                series1.push({
                  name: items.fromCurrency + '->' + items.toCurrency,
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
    this.pocDashBoardService.getRateChart(params).subscribe((res) => {
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
              name: item.sourceCurrency + '->' + item.targetCurrency,
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

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'FX SP',
          field: 'spName',
          width: 200
        },
        {
          title: 'BIC',
          field: 'spBic',
          width: 200
        },
        {
          title: 'Central Bank/Custodian Bank ',
          field: 'centralBankName',
          width: 200
        },
        {
          title: 'Activated On',
          field: 'activeTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Currency',
          tdTemplate: this.currencyTpl,
          width: 150
        },
        {
          title: 'Currency Pair',
          tdTemplate: this.currencyPairTpl,
          width: 150
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnDestroy(): void {
    window.addEventListener('resize', () => {});
  }
}
