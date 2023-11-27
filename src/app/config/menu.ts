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
    menuName: 'Commercial/Settlement Bank Management',
    id: 2,
    fatherId: 0,
    icon: 'user-switch',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-commercial-bank/commercial-bank',
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
    code: 'R0',
    children: [
      {
        id: 1,
        fatherId: 3,
        menuName: 'Central Bank Registration',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-central-bank/central-bank-regist'
      },
      {
        id: 2,
        fatherId: 3,
        menuName: 'Currency Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-central-bank/currency'
      },
    ]
  },
  {
    menuName: 'Foreign Exchange Model',
    id: 4,
    fatherId: 0,
    icon: 'deployment-unit',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-foreign-model/foreign-model',
    code: 'R0',
  },
  {
    menuName: 'Foreign Exchange Management',
    id: 5,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-foreign-exchange',
    code: 'R0',
    children: [
      {
        id: 1,
        fatherId: 5,
        menuName: 'FX Application Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-foreign-exchange/fx-application'
      },
      {
        id: 2,
        fatherId: 5,
        menuName: 'Business Activation Query',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-foreign-exchange/business-activation'
      },
    ]
  },
  {
    menuName: 'Exchange Rate Query',
    id: 6,
    fatherId: 0,
    icon: 'pay-circle',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-exchange-rate/exchange-rate',
    code: 'R0',
  },
  {
    menuName: 'FX Transactions',
    id: 7,
    fatherId: 0,
    icon: 'schedule',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-transactions/fx-transactions',
    code: 'R0',
  },
  {
    menuName: 'Settlement Model Management',
    id: 8,
    fatherId: 0,
    icon: 'check-square',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-settlement/settlement',
    code: 'R0'
  },
  {
    menuName: 'System Management',
    id: 9,
    fatherId: 0,
    icon: 'user',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-system',
    code: 'R0',
    children: [
      {
        id: 1,
        fatherId: 9,
        menuName: 'User Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-system/user'
      },
      {
        id: 2,
        fatherId: 9,
        menuName: 'Role Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-system/role'
      },
    ]
  },
];
