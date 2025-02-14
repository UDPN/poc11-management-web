/*
 * @Author: chenyuting
 * @Date: 2025-02-13 16:14:19
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-14 10:35:05
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
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit, AfterViewInit {
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  tabs: Array<any> = ['Basic Information', 'Transactions', 'Operation Records'];
  tabIndex: number = 0;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [{}];
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

  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        {
          name: 'Liquidity Provider Management'
        },
        {
          name: 'Liquidity Pool Management',
          url: '/poc/poc-provider/liquidity-pool'
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

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  resetForm(): void {
    this.searchParams = {
      operationType: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
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
          title: 'Comments',
          field: 'comments',
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
  }
}
