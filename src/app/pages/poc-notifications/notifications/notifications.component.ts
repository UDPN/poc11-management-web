import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { PocNotificationsService } from '@app/core/services/http/poc-notifications/poc-notifications.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  title: string;
  systemAnnouncementType: string | number;
  top: string | number;
  createTime: any;
}
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [{}];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  searchParam: Partial<SearchParam> = {
    title: '',
    systemAnnouncementType: '',
    top: '',
    createTime: []
  };
  constructor(
    private cdr: ChangeDetectorRef,
    private pocNotificationsService: PocNotificationsService,
    private modal: NzModalService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Notice Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit(): void {
    this.initTable();
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  resetForm(): void {
    this.searchParam = {};
    this.searchParam.createTime = [];
    this.searchParam.top = '';
    this.searchParam.systemAnnouncementType = '';
    this.getDataList(this.tableQueryParams);
  }

  getDataList(e?: NzTableQueryParams): void {
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<any> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.pocNotificationsService
    //   .getList(params.pageNum, params.pageSize, params.filters)
    //   .pipe(
    //     finalize(() => {
    //       this.tableLoading(false);
    //     })
    //   )
    //   .subscribe((_: any) => {
    //     this.dataList = _.data?.rows;
    //     this.tableConfig.total = _.data.page.total;
    //     this.tableConfig.pageIndex = params.pageNum;
    //     this.tableLoading(false);
    //     this.cdr.markForCheck();
    //   });
  }

  onStatusUpdate(
    msgCode: string,
    systemAnnouncementType: any,
    status: any
  ): void {
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${status} this notice ?`,
      nzContent: '',
      nzOnOk: () => console.log(1111)

      // new Promise((resolve, reject) => {
      //   this.pocNotificationsService.updateState({ msgCode, systemAnnouncementType, status }).subscribe({
      //     next: res => {
      //       resolve(true);
      //       this.cdr.markForCheck();
      //       if (res) {
      //         this.message.success(`${toolStatus} the user successfully!`, { nzDuration: 1000 }).onClose!.subscribe(() => {
      //           this.getDataList();
      //         });
      //       }
      //     },
      //     error: err => {
      //       reject(true);
      //       this.cdr.markForCheck();
      //     },
      //   })
      // }).catch(() => console.log('Oops errors!'))
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Title',
          field: 'title',
          width: 200
        },
        {
          title: 'Recipient',
          field: 'recipient',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Pin to Top',
          field: 'top',
          width: 150
        },
        {
          title: 'Created On',
          field: 'createTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Created By',
          field: 'createTime',
          width: 150
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 100
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
