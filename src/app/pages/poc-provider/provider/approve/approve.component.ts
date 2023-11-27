import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnCheckForm } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Location } from '@angular/common';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocProviderService } from '@app/core/services/http/poc-provider/poc-provider.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.less']
})
export class ApproveComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  documentDid: any = '';
  infoMemberLicense: any = '';
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  isOverMode$ = this.themesService.getIsOverMode();
  isCollapsed$ = this.themesService.getIsCollapsed();
  validateForm!: FormGroup;
  isLoading: boolean = false;
  constructor(public routeInfo: ActivatedRoute, private router: Router, private pocProviderService: PocProviderService, private commonService: CommonService, private fb: FormBuilder, private message: NzMessageService,private location: Location, private cdr: ChangeDetectorRef, private themesService: ThemeService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Approve`,
      breadcrumbs: [
        { name: 'Service Provider(SP) Management', url: '/poc/poc-provider/provider' },
        { name: 'Approve' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.getInfo();
    this.validateForm = this.fb.group({
      approvalResult: [0, [Validators.required]],
      comments: ['', [Validators.required]],
    })
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe(params => {
      this.pocProviderService.getInfo({ spCode: params['spCode'] || params['businessApplicationCode'] }).subscribe((res: any) => {
        this.info = res;
        if (res['businessLicenseUrl']) {
          this.commonService.download({ hash: res['businessLicenseUrl'] }).subscribe(data => {
            this.infoMemberLicense = 'data:image/jpg;base64,' + data;
            this.cdr.detectChanges();
          })
        }
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
    this.pocProviderService.approve({
      spCode: this.info.spCode,
      approvalResult: this.validateForm.get('approvalResult')?.value,
      comments: this.validateForm.get('comments')?.value,
    }).subscribe({
      next: res => {
        if (res) {
          this.message.success('Approve successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
            this.validateForm.reset();
            this.router.navigate(['/poc/poc-provider/provider']);
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
    this.router.navigate(['/poc/poc-provider/provider']);
  }

}
