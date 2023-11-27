import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocProviderService } from '@app/core/services/http/poc-provider/poc-provider.service';
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
  documentDid: any = '';
  infoMemberLicense: any = '';
  constructor(public routeInfo: ActivatedRoute, private cdr: ChangeDetectorRef, private pocProviderService: PocProviderService, private commonService: CommonService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        { name: 'Service Provider(SP) Management', url: '/poc/poc-provider/provider' },
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
    this.routeInfo.queryParams.subscribe(params => {
      this.pocProviderService.getInfo({ spCode: params['spCode'] }).subscribe((res: any) => {
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
}
