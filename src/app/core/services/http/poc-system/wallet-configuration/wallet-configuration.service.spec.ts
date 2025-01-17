/*
 * @Author: chenyuting
 * @Date: 2025-01-17 14:24:03
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-17 14:25:26
 * @Description:
 */
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WalletConfigurationrService } from './wallet-configuration.service';

describe('Service: User', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WalletConfigurationrService]
    });
  });

  it('should ...', inject(
    [WalletConfigurationrService],
    (service: WalletConfigurationrService) => {
      expect(service).toBeTruthy();
    }
  ));
});
