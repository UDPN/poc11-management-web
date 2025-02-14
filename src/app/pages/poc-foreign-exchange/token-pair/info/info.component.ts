/*
 * @Author: chenyuting
 * @Date: 2025-02-13 16:14:19
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-14 15:48:52
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
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
interface SearchParams {
  operationType: string;
}

interface BasicParam {
  createTime: any;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit, AfterViewInit {
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  tabs: Array<any> = ['Basic Information', 'Operation Records'];
  tabIndex: number = 0;
  tableConfig!: AntTableConfig;
  historyTableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [{}];
  historyList: NzSafeAny[] = [{}];
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
    operationType: ''
  };

  basicParam: Partial<BasicParam> = {
    createTime: []
  };

  constructor(private cdr: ChangeDetectorRef) {}
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
  }

  onChangeTab(event: any) {}

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
      operationType: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  resetForm1(): void {
    this.basicParam = {
      createTime: []
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
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<any> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.liquidityPoolService
    //   .getList(params.pageNum, params.pageSize, params.filters)
    //   .pipe(
    //     finalize(() => {
    //       this.tableLoading(false);
    //     })
    //   )
    //   .subscribe((_: any) => {
    //     this.dataList = _.data;
    // this.dataList.forEach((item: any, i: any) => {
    //   Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
    // });
    //     this.tableConfig.total = _?.resultPageInfo?.total;
    //     this.tableConfig.pageIndex = params.pageNum;
    //     this.tableLoading(false);
    //     this.cdr.markForCheck();
    //   });
  }

  getHistoryDataList(e?: NzTableQueryParams): void {}

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Operation Type',
          field: 'operationType',
          pipe: '',
          width: 120
        },
        {
          title: 'Created by',
          field: 'createdBy',
          width: 120
        },
        {
          title: 'Created on',
          field: 'createDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Transaction Time',
          field: 'createDate',
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
          width: 200
        },
        {
          title: 'Status',
          field: 'status',
          // pipe: 'commercialStatus',
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
          field: 'tokenPair',
          pipe: '',
          width: 120
        },
        {
          title: 'FX Rate',
          field: 'fxRate',
          width: 120
        },
        {
          title: 'Date',
          field: 'createDate',
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
