/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-25 13:30:21
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-25 19:31:34
 * @Description:
 */
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCommercialBankService } from '@app/core/services/http/poc-commercial-bank/poc-commercial-bank.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  @ViewChild('authorizedDebitTpl', { static: true }) authorizedDebitTpl!: TemplateRef<NzSafeAny>;
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
  attachmentsList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  constructor(
    public routeInfo: ActivatedRoute,
    private pocCommercialBankService: PocCommercialBankService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        {
          name: 'Commercial Bank Query',
          url: '/poc/poc-commercial-bank/commercial-bank'
        },
        { name: 'Details' }
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
    this.routeInfo.queryParams.subscribe((params) => {
      this.pocCommercialBankService
        .info({ spCode: params['spCode'] })
        .subscribe((res: any) => {
          this.info = res;
          this.dataList = res.capitalPoolActivationList;
          this.attachmentsList = res.approvedSpFileList;
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

  onLoad(approvedSpFileHash: string, fileUrl: string) {
    this.commonService
      .download({ hash: approvedSpFileHash })
      .subscribe((res) => {
        this.downloadFile(res, fileUrl);
      });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Currency',
          field: 'applicationCapitalPoolCurrency',
          width: 180
        },
        {
          title: 'Account/Wallet (Capital Pool Address)',
          field: 'applicationCapitalPoolAddress',
          width: 300
        },
        {
          title: 'Pre-authorized Debit',
          tdTemplate: this.authorizedDebitTpl,
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
