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
    code: 'R0',
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
    code: 'R0',
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
    menuName: 'Commercial Bank Query',
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
    menuName: 'FX Service Provider Management',
    id: 5,
    fatherId: 0,
    icon: 'user-switch',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-provider/provider',
    code: 'R01',
  },
  {
    menuName: 'Fx Rate Mechanism',
    id: 6,
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
    id: 7,
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
        fatherId: 7,
        menuName: 'FX Application Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0401',
        path: '/poc/poc-foreign-exchange/fx-application'
      },
      {
        id: 2,
        fatherId: 7,
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
    id: 8,
    fatherId: 0,
    icon: 'pay-circle',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-exchange-rate/exchange-rate',
    code: 'R05',
  },
  {
    menuName: 'Settlement Model Query',
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
    menuName: 'FX Transactions',
    id: 10,
    fatherId: 0,
    icon: 'schedule',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-transactions/fx-transactions',
    code: 'R06',
  },
  {
    menuName: 'System Management',
    id: 11,
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
        fatherId: 11,
        menuName: 'User Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0801',
        path: '/poc/poc-system/user'
      },
      {
        id: 2,
        fatherId: 11,
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
