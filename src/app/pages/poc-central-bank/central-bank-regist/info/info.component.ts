/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-25 13:30:21
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-25 19:31:34
 * @Description:
 */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { CentralBankRegistService } from '@app/core/services/http/poc-central-bank/central-bank-regist/central-bank-regist.service';
import { PocCommercialBankService } from '@app/core/services/http/poc-commercial-bank/poc-commercial-bank.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  agreementUrl: any = '';
  infoMemberLicense: string = '';
  constructor(
    public routeInfo: ActivatedRoute,
    private centralBankRegistService: CentralBankRegistService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        { name: 'Central Bank Management' },
        { name: 'Central Bank Registration', url: '/poc/poc-central-bank/central-bank-regist' },
        { name: 'Detail' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.getInfo();
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe((params) => {
      this.centralBankRegistService
        .info({ bankCode: params['bankCode'] })
        .subscribe((res: any) => {
          this.info = res;
          this.cdr.markForCheck();
          return;
        });
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

  private downloadFile(base64: any, fileName: string, fileType: string) {
    let typeHeader = 'data:application/' + fileType + ';base64,';

    let converedBase64 = typeHeader + base64;
    let blob = this.base64ToBlob(converedBase64, fileType);

    this.downloadExportFile(blob, fileName, fileType);
  }

  private downloadExportFile(blob: any, fileName: string, fileType: string) {
    let downloadElement = document.createElement('a');
    let href = blob;
    if (typeof blob == 'string') {
      downloadElement.target = '_blank';
    } else {
      href = window.URL.createObjectURL(blob);
    }
    downloadElement.href = href;
    downloadElement.download = fileName + '.' + fileType;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    if (typeof blob != 'string') {
      window.URL.revokeObjectURL(href);
    }
  }

  onLoad() {
    this.commonService
      .downloadEx({ hash: this.info.agreementUrl })
      .subscribe((res) => {
        this.downloadFile(res.data, res.fileName, res.fileExtension);
      });
  }
}
