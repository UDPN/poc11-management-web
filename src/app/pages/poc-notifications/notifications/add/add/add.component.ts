import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { fnCheckForm } from '@app/utils/tools';
import { PocNotificationsService } from '@app/core/services/http/poc-notifications/poc-notifications.service';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  isLoading: boolean = false;
  modules: any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: ['10px', '16px', '18px', '20px', '32px'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean']
    ]
  };
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private pocNotificationsService: PocNotificationsService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Create',
      breadcrumbs: [
        {
          name: 'Notice Management',
          url: '/poc/poc-notifications/notifications'
        },
        { name: 'Create' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required, this.titleValidator]],
      content: [null, [Validators.required]],
      systemAnnouncementType: [[], [Validators.required]],
      top: [null, [Validators.required]]
    });
  }

  titleValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value?.length > 100) {
      return { regular: true, error: true };
    }
    return {};
  };

  log(value: string[]): void {
    this.validateForm.get('systemAnnouncementType')?.setValue(value);
  }
  onBack() {
    this.location.back();
  }

  onSubmit() {
    console.log(this.validateForm.value);
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    const param = this.validateForm.value;
    param.type = 1;
    this.isLoading = true;
    this.pocNotificationsService
      .add(param)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success('Add successfully!', { nzDuration: 1000 })
              .onClose.subscribe(() => {
                this.validateForm.reset();
                this.location.back();
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
