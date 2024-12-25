/*
 * @Author: chenyuting
 * @Date: 2024-12-24 15:38:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-25 14:46:04
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PocNotificationsService } from '@app/core/services/http/poc-notifications/poc-notifications.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  roleList: any[] = [];
  content: any = '';
  constructor(
    public routeInfo: ActivatedRoute,
    private pocNotificationsService: PocNotificationsService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        { name: 'Notice Management', url: '/poc/poc-system/user' },
        { name: 'Details' }
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
    this.routeInfo.queryParams.subscribe((params: any) => {
      this.pocNotificationsService.info(params).subscribe((res: any) => {
        this.info = res;
        this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
        this.roleList = res.roleList;
        const array: any = [];
        if (res.roleList) {
          this.roleList.map((item) => {
            array.push(item.roleName);
          });
          this.roleList = array;
        }
        this.cdr.markForCheck();
        return;
      });
    });
  }
}
