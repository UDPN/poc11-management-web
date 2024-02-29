import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FxApplicationService } from '@app/core/services/http/poc-foreign-exchange/fx-application/fx-application.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnCheckForm } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Location } from '@angular/common';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.less']
})
export class ApproveComponent implements OnInit {
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('sourceCurrencyTpl', { static: true })
  sourceCurrencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('targetCurrencyTpl', { static: true })
  targetCurrencyTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  roleList: any[] = [];
  setTableConfig!: AntTableConfig;
  sourceTableConfig!: AntTableConfig;
  targetTableConfig!: AntTableConfig;
  settlementActivateList: NzSafeAny[] = [];
  settlementReduceList: NzSafeAny[] = [];
  foreignActivateList: NzSafeAny[] = [];
  foreignReduceList: NzSafeAny[] = [];
  validateForm!: FormGroup;
  isLoading: boolean = false;
  isOverMode$ = this.themesService.getIsOverMode();
  isCollapsed$ = this.themesService.getIsCollapsed();
  constructor(public routeInfo: ActivatedRoute, private router: Router, private fxApplicationService: FxApplicationService, private message: NzMessageService, private location: Location, private themesService: ThemeService, private cdr: ChangeDetectorRef, private fb: FormBuilder) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Approval`,
      breadcrumbs: [
        { name: 'Foreign Exchange Management' },
        { name: 'FX Application Management', url: '/poc/poc-foreign-exchange/fx-application' },
        { name: 'Approval' }
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
    this.validateForm = this.fb.group({
      approvalResult: [true, [Validators.required]],
      comments: ['', [Validators.required]],
    })
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
  
  onApproved() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
    this.fxApplicationService.approve({
      businessApplicationCode: this.info.businessApplicationCode,
      approvalResult: this.validateForm.get('approvalResult')?.value,
      comments: this.validateForm.get('comments')?.value,
    }).subscribe({
      next: res => {
        if (res) {
          this.message.success('Approve successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
            this.validateForm.reset();
            this.router.navigate(['/poc/poc-foreign-exchange/fx-application']);
          });
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    })
  }
  
  onBack() { 
    this.router.navigate(['/poc/poc-foreign-exchange/fx-application']);
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
