import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocProviderService } from '@app/core/services/http/poc-provider/poc-provider.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})

export class InfoComponent implements OnInit {
  @ViewChild('authorizedTpl', { static: true }) 
  authorizedTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true }) 
  currencyTpl!: TemplateRef<NzSafeAny>;
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
  attachmentsList: any[] = [];
  constructor(public routeInfo: ActivatedRoute, private cdr: ChangeDetectorRef, private pocProviderService: PocProviderService, private commonService: CommonService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        { name: 'FX Service Provider Management', url: '/poc/poc-provider/provider' },
        { name: 'Detail' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.initTable();
    this.getInfo();
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

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Currency',
          tdTemplate: this.currencyTpl,
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
