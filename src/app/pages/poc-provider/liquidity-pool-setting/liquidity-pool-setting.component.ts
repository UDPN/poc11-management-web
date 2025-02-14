/*
 * @Author: chenyuting
 * @Date: 2025-02-10 16:18:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 15:49:03
 * @Description:
 */
/*
 * @Author: chenyuting
 * @Date: 2025-02-10 16:18:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-10 16:19:32
 * @Description:
 */
import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormRecord,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LiquidityPoolSettingService } from '@app/core/services/http/poc-provider/liquidity-pool-setting/liquidity-pool-setting.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnCheckForm } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  status: string;
  createTime: any;
  spChainCode: string;
  spName: string;
}

@Component({
  selector: 'app-liquidity-pool-setting',
  templateUrl: './liquidity-pool-setting.component.html',
  styleUrls: ['./liquidity-pool-setting.component.less']
})
export class LiquidityPoolSettingComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  validateForm: FormRecord<FormControl<any>> = this.fb.record({});
  saveList: any = [];
  listOfControl: any = [];
  isLoading: boolean = false;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: NonNullableFormBuilder,
    private liquidityPoolSettingService: LiquidityPoolSettingService,
    private message: NzMessageService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Liquidity Provider Management', 'Liquidity Pool Setting'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.getSearch();
  }

  getSearch() {
    this.listOfControl = [];
    this.validateForm = this.fb.record({});
    this.liquidityPoolSettingService.getSearchToken().subscribe((res: any) => {
      if (res && res.length > 0) {
        res.forEach((item: any, index: number) => {
          const control = {
            id: index,
            centralBankName: `centralBankName${index}`,
            minimumBalance: `minimumBalance${index}`,
            centralBankId: `centralBankId${index}`
          };
          const indexs = this.listOfControl.push(control);
          this.validateForm.addControl(
            this.listOfControl[indexs - 1].centralBankName,
            this.fb.control(item.centralBankName, Validators.required)
          );
          this.validateForm.addControl(
            this.listOfControl[indexs - 1].minimumBalance,
            this.fb.control(item.minimumBalance?.toString(), [
              Validators.required,
              this.minimumBalanceValidator
            ])
          );
          this.validateForm.addControl(
            this.listOfControl[indexs - 1].centralBankId,
            this.fb.control(item.centralBankId, Validators.required)
          );
        });
      }
      this.cdr.markForCheck();
      return;
    });
  }

  minimumBalanceValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^([1-9]\d*|0)(\.\d+)?$/.test(control.value)) {
      return { error: true, regular: true };
    }
    return {};
  };

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.saveList = [];
    this.listOfControl.forEach((item: any, index: number) => {
      this.saveList.push({
        centralBankId: this.validateForm.get(`centralBankId${index}`)?.value,
        minimumBalance: Number(
          this.validateForm.get(`minimumBalance${index}`)?.value
        )
      });
    });
    this.isLoading = true;
    this.liquidityPoolSettingService.save(this.saveList).subscribe({
      next: (res) => {
        if (res) {
          this.message
            .success('Saved', { nzDuration: 1000 })
            .onClose.subscribe(() => {
              this.getSearch();
            });
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
