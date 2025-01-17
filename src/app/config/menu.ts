import { InjectionToken } from '@angular/core';
import { Menu } from '@core/services/types';

export const MENU_TOKEN = new InjectionToken<Menu[]>('menu-token', {
  providedIn: 'root',
  factory(): Menu[] {
    return menuNav;
  }
});

const menuNav: Menu[] = [
  {
    menuName: 'Dashboard',
    id: 1,
    fatherId: 0,
    icon: 'home',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-dashboard/dashboard',
    code: 'R0'
  },
  {
    menuName: 'To Do List',
    id: 2,
    fatherId: 0,
    icon: 'menu-unfold',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-home/home',
    code: 'R0'
  },
  {
    menuName: 'Custodian Bank Management',
    id: 3,
    fatherId: 0,
    icon: 'pic-left',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-central-bank',
    code: 'R02',
    children: [
      {
        id: 1,
        fatherId: 3,
        menuName: 'Custodian Bank Registration',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0201',
        path: '/poc/poc-central-bank/central-bank-regist'
      },
      {
        id: 2,
        fatherId: 3,
        menuName: 'Currency Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0202',
        path: '/poc/poc-central-bank/currency'
      }
    ]
  },
  {
    menuName: 'Commercial Bank Query',
    id: 4,
    fatherId: 0,
    icon: 'align-left',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-commercial-bank/commercial-bank',
    code: 'R06'
  },
  {
    menuName: 'Liquidity Provider Management',
    id: 5,
    fatherId: 0,
    icon: 'user-switch',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-provider/provider',
    code: 'R01'
  },
  {
    menuName: 'Foreign Exchange Management',
    id: 6,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-foreign-exchange',
    code: 'R04',
    children: [
      {
        id: 1,
        fatherId: 6,
        menuName: 'FX Application Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0401',
        path: '/poc/poc-foreign-exchange/fx-application'
      },
      {
        id: 2,
        fatherId: 6,
        menuName: 'FX Liquidity Provider Query',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0402',
        path: '/poc/poc-foreign-exchange/fx-activation'
      },
      {
        id: 3,
        fatherId: 6,
        menuName: 'Exchange Rate Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0403',
        path: '/poc/poc-foreign-exchange/exchange-rate'
      },
      {
        id: 4,
        fatherId: 6,
        menuName: 'Settlement Model Query',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0405',
        path: '/poc/poc-foreign-exchange/settlement'
      },
      {
        id: 5,
        fatherId: 6,
        menuName: 'FX Transactions',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0404',
        path: '/poc/poc-foreign-exchange/fx-transactions'
      }
    ]
  },
  {
    menuName: 'Notice Management',
    id: 7,
    fatherId: 0,
    icon: 'message',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-notifications/notifications',
    code: 'R07'
  },
  {
    menuName: 'System Management',
    id: 8,
    fatherId: 0,
    icon: 'user',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-system',
    code: 'R05',
    children: [
      {
        id: 1,
        fatherId: 8,
        menuName: 'User Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0501',
        path: '/poc/poc-system/user'
      },
      {
        id: 2,
        fatherId: 8,
        menuName: 'Role Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0502',
        path: '/poc/poc-system/role'
      },
      {
        id: 3,
        fatherId: 8,
        menuName: 'Wallet Configuration Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0502',
        path: '/poc/poc-system/wallet-configuration'
      }
    ]
  }
];
