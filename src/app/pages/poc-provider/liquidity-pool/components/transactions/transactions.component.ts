/*
 * @Author: chenyuting
 * @Date: 2025-02-14 09:45:34
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-21 10:57:16
 * @Description:
 */
/*
 * @Author: chenyuting
 * @Date: 2025-02-14 09:45:34
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-14 09:49:33
 * @Description:
 */
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface TransactionsParams {
  walletAddress: string;
  transactionType: string;
  transactionHash: any;
  bic: any;
  createTime: any;
  transactionTime: any;
  status: string | number;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less']
})
export class TransactionsComponent implements OnInit {
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true })
  amountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fxRateTpl', { static: true })
  fxRateTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [{}];
  transactionTypeList: Array<any> = [];
  transactionsParams: Partial<TransactionsParams> = {
    walletAddress: '',
    transactionType: '',
    transactionHash: '',
    createTime: [],
    transactionTime: [],
    bic: '',
    status: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
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

  resetForm(): void {
    this.transactionsParams = {
      walletAddress: '',
      transactionType: '',
      transactionHash: '',
      createTime: [],
      transactionTime: [],
      bic: '',
      status: ''
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
          title: 'Transaction No.',
          tdTemplate: this.transactionNoTpl,
          width: 140
        },
        {
          title: 'From',
          tdTemplate: this.fromTpl,
          width: 140
        },
        {
          title: 'To',
          tdTemplate: this.toTpl,
          width: 140
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
          width: 150
        },
        {
          title: 'Created on',
          field: '',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 140
        },
        {
          title: 'Transaction Time',
          field: '',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 140
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
          width: 100
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 100
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
