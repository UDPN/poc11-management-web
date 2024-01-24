import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettlementService } from '@app/core/services/http/poc-foreign-exchange/settlement/settlement.service';
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
  constructor(private settlementService: SettlementService, public routeInfo: ActivatedRoute, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        { name: 'Foreign Exchange Management'},
        { name: 'Settlement Model Query', url: '/poc/poc-foreign-exchange/settlement' },
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
      this.settlementService.getInfo({ settlementModelCode: params['settlementModelCode'] }).subscribe((res: any) => {
        this.info = res;
        this.cdr.markForCheck();
        return;
      })
    });
  }
}
