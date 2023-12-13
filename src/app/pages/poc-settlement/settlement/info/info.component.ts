import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PocSettlementService } from '@app/core/services/http/poc-settlement/poc-settlement.service';
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
  constructor(private pocSettlementService: PocSettlementService, public routeInfo: ActivatedRoute, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        { name: 'Settlement Model Query', url: '/poc/poc-settlement/settlement' },
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
      this.pocSettlementService.getInfo({ settlementModelCode: params['settlementModelCode'] }).subscribe((res: any) => {
        this.info = res;
        this.cdr.markForCheck();
        return;
      })
    });
  }
}
