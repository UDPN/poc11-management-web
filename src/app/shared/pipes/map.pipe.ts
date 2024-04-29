
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { thousandRate, thousandthMark, thousandthMarks, timestampToDate, timestampToTime } from '@app/utils/tools';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

export const enum DateFormat {
  Date = 'yyyy-MM-dd',
  DateHour = 'yyyy-MM-dd HH',
  DateTime = 'yyyy-MM-dd HH:mm'
}

export const enum MapKeyType {
  String,
  Number,
  Boolean
}

export const MapSet = {
  contractStatus: {
    0: 'To be submitted',
    1: 'Voting',
    5: 'Approved',
    10: 'Declined',
    15: 'Compilation error',
  },
  resultStatus: {
    10: 'Deployment successful',
  },
  sex: {
    0: 'female',
    1: 'male'
  },
  available: {
    true: 'enable',
    false: 'disable'
  },
  isOrNot: {
    true: 'yes',
    false: 'no'
  },
  visible: {
    true: 'open',
    false: 'hide'
  },
  transactionType: {
    1: 'Contract Deployment',
    2: 'Contract Call'
  },
  transactionResult: {
    1: 'Pending',
    5: 'Success',
    10: 'Fail'
  },
  accessStatus: {
    0: 'Enabled',
    1: 'Disabled',
    2: 'Expired'
  },
  receiptStatus: {
    0: 'Failed',
    1: 'Successful',
  },
  version: {
    1: 'enterprise',
    0: 'standard'
  },
  accessibleType: {
    1: 'Myself',
    2: 'From BN',
    3: 'Public',
    4: 'Official'
  },
  applicationStatus: {
    0: 'Waiting for Approval',
    1: 'Approved',
    2: 'Rejected'
  },
  chargingModel: {
    1: 'Proportional Charges',
    2: 'Fixed Charges'
  },
  approvalResult: {
    0: 'Approve',
    1: 'Reject',
  },
  commercialStatus: {
    0: 'Active',
    1: 'Inactive'
  },
  lockable: {
    1: 'Inactive',
    2: 'Active'
  },
  transactionsStatus: {
    1: 'Success',
    2: 'Failure'
  },
  businessType: {
    1: 'Foreign Exchange Business',
    2: 'Currency Business',
    3: 'Currency and Foreign Exchange Business',
  },
  currencyBusinessType: {
    0: 'Activate',
    1: 'Deactivate'
  },
  bankType: {
    1: 'Commercial Bank',
    2: 'SP'
  },
  bankTypeStatus: {
    1: 'No',
    2: 'Yes'
  },
  todoType: {
    1: 'Commercial bank Onboarding',
    2: 'Business Application',
    3: 'Activate Settlement Business',
  },
  dashBoradBankType: {
    1: 'Central Banks',
    2: 'Commercial Banks',
    3: 'FX Service Providers(FX SPs)',
  }
};

export interface MapItem {
  label: string;
  value: NzSafeAny;
}

@Pipe({
  name: 'map'
})
export class MapPipe implements PipeTransform {
  private datePipe: DatePipe = new DatePipe('en-US');
  private mapObj = MapSet;

  static transformMapToArray(data: NzSafeAny, mapKeyType: MapKeyType = MapKeyType.Number): MapItem[] {
    return Object.keys(data || {}).map(key => {
      let value: NzSafeAny;
      switch (mapKeyType) {
        case MapKeyType.Number:
          value = Number(key);
          break;
        case MapKeyType.Boolean:
          value = key === 'true';
          break;
        case MapKeyType.String:
        default:
          value = key;
          break;
      }
      return { value, label: data[key] };
    });
  }

  transform(value: NzSafeAny, arg?: NzSafeAny): NzSafeAny {
    if (arg === undefined) {
      return value;
    }
    if (arg === 'nullValue') {
      if (!value) {
        return value = '--';
      } else {
        return value;
      }
    }
    if (arg === 'null') {
      if (value?.indexOf(undefined) !== -1 || value.indexOf('null') !== -1) {
        return value = '--';
      } else {
        return value;
      }
    }
    if (arg === 'timeStamp') {
      if (!value) {
        return value = '--';
      } else {
        value = value.toString();
        if (value.length === 10) {
          value = Number(value) * 1000;
        }
        let res = this.datePipe.transform(value, 'MMMM d, y HH:mm:ss a zzzz');
        return res?.replace('GMT', 'UTC');
      }
    }
    if (arg === 'toThousandthMark') {
      if (value === null || value === '' || value === undefined) {
        return (value = '--');
      } else {
        return thousandthMark(value);
      }
    }
    if (arg === 'toThousandthMarks') {
      if (value === null || value === '' || value === undefined) {
        return (value = '--');
      } else {
        return thousandthMarks(value);
      }
    }
    // Rate
    if (arg === 'toThousandRate') {
      if (value === null || value === '' || value === undefined) {
        return (value = '--');
      } else {
        return thousandRate(value);
      }
    }
    if (arg === 'dateStamp') {
      if (!value) {
        return (value = '--');
      } else {
        return timestampToDate(value);
      }
    }
    let type: string = arg;
    let param = '';

    if (arg.indexOf(':') !== -1) {
      type = arg.substring(0, arg.indexOf(':'));
      param
        = arg.substring(arg.indexOf(':') + 1, arg.length);
    }
    switch (type) {
      case 'date':
        return this.datePipe.transform(value, param);
      default:
        // @ts-ignore
        return this.mapObj[type] ? this.mapObj[type][value] : '';
    }
  }
}
