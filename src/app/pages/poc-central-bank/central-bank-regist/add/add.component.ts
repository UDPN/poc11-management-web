import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm } from '@app/utils/tools';
import { finalize } from 'rxjs';
import { CommonService } from '@app/core/services/http/common/common.service';
import { CentralBankRegistService } from '@app/core/services/http/poc-central-bank/central-bank-regist/central-bank-regist.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  info: any = {};
  isLoading: boolean = false;
  tempStatus: boolean = true;
  countryList: any = [];
  bnIdList: any = [];
  fileImg: any = '';
  fileImgWord: any = '';
  fileStatus: number = 1;
  fileType: number = 0;
  orignalFileHash: string = '';
  constructor(
    private fb: FormBuilder,
    public routeInfo: ActivatedRoute,
    private commonService: CommonService,
    private message: NzMessageService,
    private centralBankRegistService: CentralBankRegistService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: this.tempStatus === true ? 'Create' : 'Edit',
      breadcrumbs: [
        { name: 'Central Bank Management' },
        { name: 'Central Bank Registration', url: '/poc/poc-central-bank/central-bank-regist' },
        { name: this.tempStatus === true ? 'Create' : 'Edit' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.initSelect();
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (JSON.stringify(params) !== '{}') {
        this.tempStatus = false;
        this.getInfo(params['bankCode']);
      }
    })
    this.validateForm = this.fb.group({
      centralBankName: [null, [Validators.required, this.centralBankNameValidator]],
      centralBankIntroduction: [null, [Validators.required]],
      bnCode: [null, [Validators.required]],
      agreementUrl: [null, [Validators.required]],
      countryInfoId: [null, [Validators.required]],
      besuWalletAddress: [null, [Validators.required]],
    })
  }

  initSelect() {
    this.commonService.getSelect({ dropDownTypeCode: 'drop_down_country_info' }).subscribe((res) => {
      this.countryList = res.dataInfo;
      this.cdr.markForCheck();
    })

    this.commonService.getBnId().subscribe((res) => {
      this.bnIdList = res;
      this.cdr.markForCheck();
    })
  }

  onDownload() {
    location.href = '../../../../assets/walletAddress/udpn-besu-sdk-1.0.0.jar';
  }

  uploadFileSig($event: any) {
    const fielSize = $event.target.files[0]?.size! / 1024 / 1024 > 10;
    if (fielSize && $event.target.files[0] !== undefined) {
      this.message.error('Size less than 10 MB');
    } else {
      this.fileStatus = 3;
      const reader = new FileReader();

      reader.readAsDataURL($event.target.files[0]);
      reader.onload = () => {
        this.fileImg = reader.result;
        this.fileImgWord = $event.target.files[0];
        this.cdr.markForCheck();
        this.validateForm.get('agreementUrl')?.setValue(this.fileImg);
        if (this.validateForm.get('agreementUrl')?.value !== '') {
          this.fileStatus = 2;
        } else {
          this.fileStatus = 1;
        }
      };
    }
  }

  onDeleteFile(): void {
    let ss: any = window.document.getElementById("files")!;
    ss.value = "";
    this.fileStatus = 1;
    this.validateForm.get('agreementUrl')?.setValue('');
  }

  centralBankNameValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^[^0-9][\s\S]{1,49}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  getInfo(bankCode: string): void {
    this.centralBankRegistService.info({ bankCode }).subscribe((res: any) => {
      this.info = res;
      this.validateForm.get('centralBankName')?.setValue(res.bankName);
      this.validateForm.get('centralBankIntroduction')?.setValue(res.bankIntroduction);
      this.validateForm.get('besuWalletAddress')?.setValue(res.besuWalletAddress);
      this.validateForm.get('bnCode')?.setValue(res.bnCode);
      this.validateForm.get('agreementUrl')?.setValue(res.agreementUrl);
      this.orignalFileHash = res.agreementUrl;
      if (res.agreementUrl) {
        this.fileStatus = 2;
      }
      this.countryList.forEach((item: any) => {
        if (item.countryName === res.country) {
          this.validateForm.get('countryInfoId')?.setValue(item.countryId);
        }
      });
      this.cdr.markForCheck();
      return;
    })
  }

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
    if (this.tempStatus === true) {
      const saveParam = {
        centralBankName: this.validateForm.get('centralBankName')?.value,
        countryInfoId: this.validateForm.get('countryInfoId')?.value,
        centralBankIntroduction: this.validateForm.get('centralBankIntroduction')?.value,
        besuWalletAddress: this.validateForm.get('besuWalletAddress')?.value,
        bnCode: this.validateForm.get('bnCode')?.value,
        agreementUrl: this.validateForm.get('agreementUrl')?.value,
      }
      this.commonService.upload(this.fileImgWord).subscribe({
        next: res => {
          if (res) {
            saveParam.agreementUrl = res;
            this.centralBankRegistService.add(saveParam).pipe(finalize(() => this.isLoading = false)).subscribe({
              next: res => {
                if (res) {
                  this.message.success('Add successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
                    this.validateForm.reset();
                    this.location.back();
                  });
                }
                this.isLoading = false;
                this.cdr.markForCheck();
              },
              error: err => {
                this.isLoading = false;
                this.cdr.markForCheck();
              }
            })
          }
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    } else {
      const editParam = {
        bankCode: this.info.bankCode,
        centralBankIntroduction: this.validateForm.get('centralBankIntroduction')?.value,
        bnCode: this.validateForm.get('bnCode')?.value,
        agreementUrl: this.validateForm.get('agreementUrl')?.value,
        countryInfoId: this.validateForm.get('countryInfoId')?.value,
        besuWalletAddress: this.validateForm.get('besuWalletAddress')?.value,
      }
      if (!this.validateForm.get('agreementUrl')?.value || this.validateForm.get('agreementUrl')?.value === this.orignalFileHash) {
        this.centralBankRegistService.edit(editParam).pipe(finalize(() => this.isLoading = false)).subscribe({
          next: res => {
            if (res) {
              this.message.success('Edit successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
                this.validateForm.reset();
                this.location.back();
              });
            }
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: err => {
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        })
      } else {
        this.commonService.upload(this.fileImgWord).subscribe({
          next: res => {
            editParam.agreementUrl = res;
            this.centralBankRegistService.edit(editParam).pipe(finalize(() => this.isLoading = false)).subscribe({
              next: res => {
                this.isLoading = false;
                if (res) {
                  this.message.success('Edit successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
                    this.validateForm.reset();
                    this.location.back();
                  });
                }
                this.cdr.markForCheck();
              },
              error: err => {
                this.isLoading = false;
                this.cdr.markForCheck();
              }
            })
          },
          error: err => {
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        })
      }
    }
  }

  onBack() {
    this.location.back();
  }

}
