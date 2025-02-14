/*
 * @Author: chenyuting
 * @Date: 2025-02-13 16:15:34
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 17:38:40
 * @Description:
 */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { fnCheckForm } from '@app/utils/tools';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LiquidityPoolService } from '@app/core/services/http/poc-provider/liquidity-pool/liquidity-pool.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.less']
})
export class ApproveComponent implements OnInit {
  isOverMode$ = this.themesService.getIsOverMode();
  isCollapsed$ = this.themesService.getIsCollapsed();
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  isLoading: boolean = false;
  validateForm!: FormGroup;
  constructor(
    private themesService: ThemeService,
    private fb: FormBuilder,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService,
    private liquidityPoolService: LiquidityPoolService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Approval`,
      breadcrumbs: [
        {
          name: 'Liquidity Provider Management'
        },
        {
          name: 'Liquidity Pool Management',
          url: '/poc/poc-provider/liquidity-pool'
        },
        { name: 'Approval' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      approvalResult: [0, [Validators.required]],
      comments: ['', [Validators.required]]
    });
  }

  onSubmit() {
    // if (!fnCheckForm(this.validateForm)) {
    //   return;
    // }
    // this.isLoading = true;
    // this.liquidityPoolService
    //   .approve({
    //     spCode: this.info.spCode,
    //     approvalResult: this.validateForm.get('approvalResult')?.value,
    //     comments: this.validateForm.get('comments')?.value
    //   })
    //   .subscribe({
    //     next: (res) => {
    //       if (res) {
    //         this.message
    //           .success('Approve successfully!', { nzDuration: 1000 })
    //           .onClose.subscribe(() => {
    //             this.validateForm.reset();
    //             this.router.navigate(['/poc/poc-provider/liquidity-pool']);
    //           });
    //       }
    //       this.isLoading = false;
    //       this.cdr.markForCheck();
    //     },
    //     error: (err) => {
    //       this.isLoading = false;
    //       this.cdr.markForCheck();
    //     }
    //   });
  }
  onBack() {
    this.location.back();
  }
}
