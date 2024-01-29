import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('spTpl', { static: true }) spTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  solutionCenterList: any = [];
  url: any = '';
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  constructor(private themesService: ThemeService, private dataService: LoginService, private router: Router, private pocHomeService: PocHomeService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['To Do List'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
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

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    };
    this.pocHomeService.getList(params.pageNum, params.pageSize).pipe(finalize(() => {
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

  onApprove(todoType: string, businessApplicationCode: string) {
    if (todoType === '3') {
      const queryParams = { spCode: businessApplicationCode };
      this.router.navigate(['/poc/poc-provider/provider/approve'], { queryParams })
    } else if (todoType === '2') {
      const queryParams = { businessApplicationCode };
      this.router.navigate(['/poc/poc-foreign-exchange/fx-application/approve'], { queryParams })
    }
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Creation Time',
          field: 'createDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Type',
          field: 'todoType',
          pipe: 'todoType',
          width: 220
        },
        {
          title: 'SP',
          tdTemplate: this.spTpl,
          width: 450
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
          width: 120
        },
        {
          title: 'Action',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 100

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
