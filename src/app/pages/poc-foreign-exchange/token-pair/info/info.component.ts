/*
 * @Author: chenyuting
 * @Date: 2025-02-13 16:14:19
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-21 11:21:19
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenPairService } from '@app/core/services/http/poc-foreign-exchange/token-pair/token-pair.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
interface SearchParams {
  operationType: string;
  exchangeId: string;
}

interface BasicParam {
  createTime: any;
  exchangeId: string;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit, AfterViewInit {
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('tokenPairTpl', { static: true })
  tokenPairTpl!: TemplateRef<NzSafeAny>;
  tabs: Array<any> = ['Basic Information', 'Operation Records'];
  tabIndex: number = 0;
  tableConfig!: AntTableConfig;
  historyTableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  historyList: NzSafeAny[] = [];
  basicInfo: any = {};
  exchangeId: string = '';
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParams: Partial<SearchParams> = {
    operationType: '',
    exchangeId: ''
  };

  basicParam: Partial<BasicParam> = {
    createTime: [],
    exchangeId: ''
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private routeInfo: ActivatedRoute,
    private tokenPairService: TokenPairService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        {
          name: 'FX Management'
        },
        {
          name: 'Token Pair Management',
          url: '/poc/poc-foreign-exchange/token-pair'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit(): void {
    this.initTable();
    this.routeInfo.queryParams.subscribe((params) => {
      this.exchangeId = params['exchangeId'];
      this.onChangeTab(0);
    });
  }

  onChangeTab(event: any) {
    this.tabIndex = event;
    if (event === 0) {
      this.getBasicInfo();
    }
  }

  getBasicInfo(): void {
    this.tokenPairService
      .getBasicInfo({ exchangeId: this.exchangeId })
      .subscribe((res: any) => {
        this.basicInfo = res;
        this.cdr.markForCheck();
        return;
      });
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableChangeDectctionHistory(): void {
    this.historyList = [...this.historyList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  historyTableLoading(isLoading: boolean): void {
    this.historyTableConfig.loading = isLoading;
    this.tableChangeDectctionHistory();
  }

  resetForm(): void {
    this.searchParams = {
      operationType: '',
      exchangeId: this.exchangeId
    };
    this.getDataList(this.tableQueryParams);
  }

  resetForm1(): void {
    this.basicParam = {
      createTime: [],
      exchangeId: this.exchangeId
    };
    this.getHistoryDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  changePageSize1(e: number): void {
    this.historyTableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.searchParams.exchangeId = this.exchangeId;
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParams
    };
    this.tokenPairService
      .getRecordsInfo(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data;
        this.tableConfig.total = _?.resultPageInfo?.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  getHistoryDataList(e?: NzTableQueryParams): void {
    this.basicParam.exchangeId = this.exchangeId;
    this.historyTableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.basicParam
    };
    this.tokenPairService
      .getHistoryInfoList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.historyTableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data;
        this.historyTableConfig.total = _?.resultPageInfo?.total;
        this.historyTableConfig.pageIndex = params.pageNum;
        this.historyTableLoading(false);
        this.cdr.markForCheck();
      });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Operation Type',
          field: 'operationType',
          pipe: 'tokenPairOperationType',
          width: 120
        },
        {
          title: 'Created By',
          field: 'createdBy',
          width: 120
        },
        {
          title: 'Created on',
          field: 'createdOn',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Transaction Time',
          field: 'transactionTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Transaction Hash',
          tdTemplate: this.transactionHashTpl,
          width: 140
        },
        {
          title: 'Comments',
          field: 'comments',
          pipe: 'showNone',
          width: 200
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
          width: 140
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
    this.historyTableConfig = {
      headers: [
        {
          title: 'Token Pair',
          tdTemplate: this.tokenPairTpl,
          pipe: '',
          width: 120
        },
        {
          title: 'FX Rate',
          field: 'fxRate',
          pipe: 'toThousandthMark',
          width: 120
        },
        {
          title: 'Date',
          field: 'updatedOn',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 200
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
