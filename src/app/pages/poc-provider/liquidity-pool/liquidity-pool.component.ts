/*
 * @Author: chenyuting
 * @Date: 2025-02-13 13:34:23
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 17:21:12
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LiquidityPoolService } from '@app/core/services/http/poc-provider/liquidity-pool/liquidity-pool.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  liquidityPoolAddress: string;
  tokenName: string;
  liquidityPoolName: any;
  bic: any;
  createTime: any;
  status: string | number;
}
@Component({
  selector: 'app-liquidity-pool',
  templateUrl: './liquidity-pool.component.html',
  styleUrls: ['./liquidity-pool.component.less']
})
export class LiquidityPoolComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('liquidityPoolAddressTpl', { static: true })
  liquidityPoolAddressTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  currencyList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [{}];
  isVisible: boolean = false;
  visibleType: number = 0;
  visibleForm!: FormGroup;
  isLoading: boolean = false;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    liquidityPoolAddress: '',
    tokenName: '',
    liquidityPoolName: '',
    createTime: [],
    bic: '',
    status: ''
  };

  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private liquidityPoolService: LiquidityPoolService,
    private fb: FormBuilder,
    private modal: NzModalService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: [
        'Liquidity Provider Management',
        'Liquidity Pool Management'
      ],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit() {
    this.initTable();
    this.visibleForm = this.fb.group({
      liquidityPoolAddress: [''],
      token: [''],
      comments: ['', [Validators.required]]
    });
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
    this.searchParam = {
      liquidityPoolAddress: '',
      tokenName: '',
      liquidityPoolName: '',
      createTime: [],
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

  openVisible(type: number, isOpen?: boolean) {
    if (isOpen === false) {
      this.modal.warning({
        nzTitle: 'Warning',
        nzContent:
          'The Liquidity Pool Address(...71b5) cannot be deactivated due to existing associated token pairs. Please deactivate them before proceeding.'
      });
    } else {
      this.isVisible = true;
      this.visibleType = type;
    }
  }
  cancelVisible() {
    this.isVisible = false;
    this.visibleForm.reset();
  }

  onStatusUpdate() {}

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'No.',
          tdTemplate: this.numberTpl,
          width: 80
        },
        {
          title: 'Liquidity Pool Address',
          tdTemplate: this.liquidityPoolAddressTpl,
          width: 280
        },
        {
          title: 'Token Name',
          field: 'tokenName',
          width: 150
        },
        {
          title: 'Liquidity Provider Name',
          field: 'liquidityPoolName',
          width: 180
        },
        {
          title: 'BIC',
          field: 'bic',
          width: 150
        },
        {
          title: 'Created on',
          field: 'createDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 160
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
          width: 220
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
