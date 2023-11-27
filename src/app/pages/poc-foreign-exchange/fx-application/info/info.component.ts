import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FxApplicationService } from '@app/core/services/http/poc-foreign-exchange/fx-application/fx-application.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  @ViewChild('currencyTpl', { static: true }) currencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('sourceCurrencyTpl', { static: true }) sourceCurrencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('targetCurrencyTpl', { static: true }) targetCurrencyTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  setTableConfig!: AntTableConfig;
  sourceTableConfig!: AntTableConfig;
  targetTableConfig!: AntTableConfig;
  settlementActivateList: NzSafeAny[] = [];
  settlementReduceList: NzSafeAny[] = [];
  foreignActivateList: NzSafeAny[] = [];
  foreignReduceList: NzSafeAny[] = [];
  constructor(public routeInfo: ActivatedRoute, private fxApplicationService: FxApplicationService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        { name: 'Foreign Exchange Management' },
        { name: 'FX Application Management', url: '/poc/poc-foreign-exchange/fx-application' },
        { name: 'Detail' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.getInfo();
    this.settlementInitTable();
    this.foreignInitTable();
  }

  changePageSize(e: number): void {
    this.setTableConfig.pageSize = e;
  }

  changePageSizes(e: number): void {
    this.sourceTableConfig.pageSize = e;
    this.targetTableConfig.pageSize = e;
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe(params => {
      this.fxApplicationService.getInfo({ businessApplicationCode: params['businessApplicationCode'] }).subscribe((res: any) => {
        this.info = res;
        this.settlementActivateList = res.outActivateCapitalPoolApplicationList;
        this.settlementReduceList = res.outReduceCapitalPoolApplicationList;
        this.foreignActivateList = res.outActivateApplicationRateList;
        this.foreignReduceList = res.outReduceApplicationRateList;
        this.cdr.markForCheck();
        return;
      })
    });
  }

  private settlementInitTable(): void {
    this.setTableConfig = {
      headers: [
        {
          title: 'Currency',
          tdTemplate: this.currencyTpl,
          width: 220
        },
        {
          title: 'Capital Pool Address',
          field: 'applicationCapitalPoolAddress',
          width: 220
        },
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }

  private foreignInitTable(): void {
    this.sourceTableConfig = {
      headers: [
        {
          title: 'Base Currency',
          tdTemplate: this.sourceCurrencyTpl,
          width: 220
        },
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
    };
    this.targetTableConfig = {
      headers: [
        {
          title: 'Quote Currency',
          tdTemplate: this.targetCurrencyTpl,
          width: 220
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
