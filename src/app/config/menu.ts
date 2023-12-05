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
    menuName: 'Home',
    id: 1,
    fatherId: 0,
    icon: 'home',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-home/home',
    code: 'R0',
  },
  {
    menuName: 'Service Provider(SP) Management',
    id: 2,
    fatherId: 0,
    icon: 'user-switch',

    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-provider/provider',
    code: 'R01',
  },
  {
    menuName: 'Central Bank Management',
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
        menuName: 'Central Bank Registration',
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
      },
    ]
  },
  {
    menuName: 'Commercial Bank/Service Provider(SP) Query',
    id: 4,
    fatherId: 0,
    icon: 'align-left',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-commercial-bank/commercial-bank',
    code: 'R09',
  },
  {
    menuName: 'Fx Rate Mechanism',
    id: 5,
    fatherId: 0,
    icon: 'deployment-unit',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-foreign-model/foreign-model',
    code: 'R03',
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
        menuName: 'Business Activation Query',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0402',
        path: '/poc/poc-foreign-exchange/business-activation'
      },
    ]
  },
  {
    menuName: 'Exchange Rate Query',
    id: 7,
    fatherId: 0,
    icon: 'pay-circle',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-exchange-rate/exchange-rate',
    code: 'R05',
  },
  {
    menuName: 'FX Transactions',
    id: 8,
    fatherId: 0,
    icon: 'schedule',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-transactions/fx-transactions',
    code: 'R06',
  },
  {
    menuName: 'Settlement Model Management',
    id: 9,
    fatherId: 0,
    icon: 'check-square',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-settlement/settlement',
    code: 'R07'
  },
  {
    menuName: 'System Management',
    id: 10,
    fatherId: 0,
    icon: 'user',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-system',
    code: 'R08',
    children: [
      {
        id: 1,
        fatherId: 10,
        menuName: 'User Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0801',
        path: '/poc/poc-system/user'
      },
      {
        id: 2,
        fatherId: 10,
        menuName: 'Role Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0802',
        path: '/poc/poc-system/role'
      },
    ]
  },
];
