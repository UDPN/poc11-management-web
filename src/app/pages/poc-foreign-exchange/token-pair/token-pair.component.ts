/*
 * @Author: chenyuting
 * @Date: 2025-02-13 13:44:30
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-21 13:18:49
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
import { TokenPairService } from '@app/core/services/http/poc-foreign-exchange/token-pair/token-pair.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  tokenPair: string;
  formRateCurrency: string;
  toRateCurrency: string;
  updatedTime: any;
  status: any;
}
@Component({
  selector: 'app-token-pair',
  templateUrl: './token-pair.component.html',
  styleUrls: ['./token-pair.component.less']
})
export class TokenPairComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('tokenPairTpl', { static: true })
  tokenPairTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  tokenPairList: Array<any> = [];
  tableConfig!: AntTableConfig;
  visibleForm!: FormGroup;
  isVisible: boolean = false;
  visibleTitle: string = '';
  visibleTip: string = '';
  isLoading: boolean = false;
  dataList: NzSafeAny[] = [];
  exchangeId: any = '';
  status: number = 0;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    tokenPair: '',
    formRateCurrency: '',
    toRateCurrency: '',
    updatedTime: [],
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
    private fb: FormBuilder,
    private tokenPairService: TokenPairService,
    private message: NzMessageService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['FX Management', 'Token Pair Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit() {
    this.initTable();
    this.getTokenPairList();
    this.visibleForm = this.fb.group({
      token: [''],
      comments: ['', [Validators.required]]
    });
  }

  getTokenPairList() {
    this.tokenPairService.getTokenPair().subscribe((res: any) => {
      this.tokenPairList = res;
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
      tokenPair: '',
      formRateCurrency: '',
      toRateCurrency: '',
      updatedTime: [],
      status: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    if (this.searchParam.tokenPair) {
      this.searchParam.formRateCurrency =
        this.searchParam.tokenPair.split('/')[0];
      this.searchParam.toRateCurrency =
        this.searchParam.tokenPair.split('/')[1];
    } else {
      this.searchParam.formRateCurrency = '';
      this.searchParam.toRateCurrency = '';
    }
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.tokenPairService
      .getList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data;
        this.dataList.forEach((item: any, i: any) => {
          Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
        });
        this.tableConfig.total = _?.resultPageInfo?.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  openVisible(value: number, exchangeId: any) {
    this.isVisible = true;
    this.exchangeId = exchangeId;
    if (value === 1) {
      this.status = 1;
      this.visibleTitle = 'Deactivate Token Pair';
      this.visibleTip =
        'Deactivate the token pair to disable token exchanges in transactions.';
    } else {
      this.status = 0;
      this.visibleTitle = 'Activate Token Pair';
      this.visibleTip =
        'Activate the token pair to enable token exchanges in transactions.';
    }
  }

  cancelVisible() {
    this.isVisible = false;
    this.status = 0;
    this.exchangeId = '';
    this.visibleForm.reset();
  }

  onStatusUpdate() {
    this.isLoading = true;
    this.tokenPairService
      .updateStatus({
        exchangeId: this.exchangeId,
        status: this.status,
        comments: ''
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success(
                `${
                  this.status === 1 ? 'Deactivated' : 'Activated'
                } successfully!`,
                { nzDuration: 1000 }
              )
              .onClose.subscribe(() => {
                this.visibleForm.reset();
                this.getDataList(this.tableQueryParams);
              });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'No.',
          tdTemplate: this.numberTpl,
          width: 130
        },
        {
          title: 'Token Pair',
          tdTemplate: this.tokenPairTpl,
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'FX Rate',
          field: 'exchangeRate',
          pipe: 'toThousandthMark',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'FX Rate Updated on',
          field: 'rateDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
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
