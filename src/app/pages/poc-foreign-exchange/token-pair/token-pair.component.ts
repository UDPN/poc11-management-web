/*
 * @Author: chenyuting
 * @Date: 2025-02-13 13:44:30
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-14 15:22:06
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
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  tokenPair: string;
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
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  currencyList: Array<any> = [];
  tableConfig!: AntTableConfig;
  visibleForm!: FormGroup;
  isVisible: boolean = false;
  visibleTitle: string = '';
  visibleTip: string = '';
  isLoading: boolean = false;
  dataList: NzSafeAny[] = [{}];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    tokenPair: '',
    updatedTime: [],
    status: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {}
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
    this.visibleForm = this.fb.group({
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
    this.searchParam = {};
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {}

  openVisible(value: number) {
    this.isVisible = true;
    if (value === 1) {
      this.visibleTitle = 'Deactivate Token Pair';
      this.visibleTip =
        'Deactivate the token pair to disable token exchanges in transactions.';
    } else {
      this.visibleTitle = 'Activate Token Pair';
      this.visibleTip =
        'Activate the token pair to enable token exchanges in transactions.';
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
          width: 130
        },
        {
          title: 'Token Pair',
          field: 'tokenPair',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'FX Rate',
          field: 'fxRate',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'FX Rate Updated on',
          field: '',
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
