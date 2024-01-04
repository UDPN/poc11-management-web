import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  @ViewChild('authorizedTpl', { static: true }) authorizedTpl!: TemplateRef<NzSafeAny>;
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
  attachmentsList: any[] = [];
  constructor(public routeInfo: ActivatedRoute, private router: Router, private pocProviderService: PocProviderService, private commonService: CommonService, private fb: FormBuilder, private message: NzMessageService, private location: Location, private cdr: ChangeDetectorRef, private themesService: ThemeService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Approved`,
      breadcrumbs: [
        { name: 'FX Service Provider Management', url: '/poc/poc-provider/provider' },
        { name: 'Approved' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.initTable();
    this.getInfo();
    this.validateForm = this.fb.group({
      approvalResult: [0, [Validators.required]],
      comments: ['', [Validators.required]],
    })
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe(params => {
      this.pocProviderService.getInfo({ spCode: params['spCode'] }).subscribe((res: any) => {
        this.info = res;
        this.dataList = res.capitalPoolList;
        this.attachmentsList = res.bankFileList;
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

  private base64ToBlob(urlData: string, type: string) {
    let arr = urlData.split(',');
    let array = arr[0].match(/:(.*?);/);
    let mime = (array && array.length > 1 ? array[1] : type) || type;
    let bytes = window.atob(arr[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mime
    });
  }

  private downloadFile(base64: any, fileName: string) {
    const fileType = fileName.slice(fileName.lastIndexOf('.') + 1);
    let typeHeader = 'data:application/' + fileType + ';base64,';
    let converedBase64 = typeHeader + base64;
    let blob = this.base64ToBlob(converedBase64, fileType);
    this.downloadExportFile(blob, fileName);
  }

  private downloadExportFile(blob: any, fileName: string) {
    let downloadElement = document.createElement('a');
    let href = blob;
    if (typeof blob == 'string') {
      downloadElement.target = '_blank';
    } else {
      href = window.URL.createObjectURL(blob);
    }
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    if (typeof blob != 'string') {
      window.URL.revokeObjectURL(href);
    }
  }

  onLoad(settlementBankFileHash: string, fileUrl: string) {
    this.commonService
      .download({ hash: settlementBankFileHash })
      .subscribe((res) => {
        this.downloadFile(res, fileUrl);
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


  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Currency',
          field: 'settlementCapitalPoolCurrency',
          width: 180
        },
        {
          title: 'Account/Wallet (Capital Pool Address)',
          field: 'settlementCapitalPoolAddress',
          width: 300
        },
        {
          title: 'Pre-authorized Debit',
          tdTemplate: this.authorizedTpl,
          width: 120
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
