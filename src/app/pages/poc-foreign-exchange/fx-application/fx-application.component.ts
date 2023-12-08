import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { FxApplicationService } from '@app/core/services/http/poc-foreign-exchange/fx-application/fx-application.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  createTime: any;
  status: string;
  spCode: string;
  spName: string;
  applicationCode: string;
  businessType: string;
}

@Component({
  selector: 'app-fx-application',
  templateUrl: './fx-application.component.html',
  styleUrls: ['./fx-application.component.less'],
})
export class FxApplicationComponent implements OnInit, AfterViewInit {
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
    status: '',
    businessType: ''
  };
  statusList: any = [];
  businessTypeList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  constructor(private fxApplicationService: FxApplicationService,private commonService: CommonService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: [ 'Foreign Exchange Management', 'FX Application Management'],
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
    this.searchParam.createTime = [],
    this.searchParam.status = '',
    this.searchParam.businessType = '',
    this.getDataList(this.tableQueryParams);
  }
  
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'BUSINESS_APPLICATION_STATUS' }).subscribe((res) => {
      this.statusList = res.dataInfo;
    })

    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'FXPLT_BUSINESS_TYPE' }).subscribe((res) => {
      this.businessTypeList = res.dataInfo;
    })
  }
  
  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.fxApplicationService.getList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
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
          title: 'Application No.',
          field: 'businessApplicationCode',
          width: 280
        },
        {
          title: 'FX SP ID',
          field: 'spCode',
          width: 320
        },
        {
          title: 'FX SP Name',
          field: 'spName',
          width: 180
        },
        {
          title: 'Business Type',
          field: 'businessType',
          pipe: 'businessType',
          width: 200
        },
        {
          title: 'Application Time',
          field: 'applicationTime',
          pipe: 'timeStamp',
          width: 180
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
          width: 180

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
