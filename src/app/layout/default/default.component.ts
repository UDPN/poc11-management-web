import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { fadeRouteAnimation } from '@app/animations/fade.animation';
import { IsFirstLogin } from '@config/constant';
import { DestroyService } from '@core/services/common/destory.service';
import { DriverService } from '@core/services/common/driver.service';
import { WindowService } from '@core/services/common/window.service';
import { ThemeService } from '@store/common-store/theme.service';

import { NavDrawerComponent } from './nav-drawer/nav-drawer.component';
import { LogoService } from '@app/core/services/http/poc-system/logo.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  providers: [DestroyService]
})
export class DefaultComponent implements OnInit, AfterViewInit {
  isCollapsed$ = this.themesService.getIsCollapsed();
  isOverMode$: Observable<boolean> = this.themesService.getIsOverMode();
  themeOptions$ = this.themesService.getThemesMode();
  isCollapsed = false;
  isOverMode = false; 
  isDefaultLogo: boolean = true;
  logoImg: any = '';
  @ViewChild('navDrawer') navDrawer!: NavDrawerComponent;
  constructor(private destroy$: DestroyService,private logoService: LogoService,private cdr: ChangeDetectorRef, private themesService: ThemeService, private driverService: DriverService, private windowService: WindowService) {}

  changeCollapsed(): void {
    if (this.isOverMode) {
      this.navDrawer.showDraw();
      return;
    }
    this.isCollapsed = !this.isCollapsed;
    this.themesService.setIsCollapsed(this.isCollapsed);
  }

  
  subTheme(): void {
    this.themesService
      .getIsCollapsed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.isCollapsed = res));
    this.themesService
      .getIsOverMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.isOverMode = res));
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  ngAfterViewInit(): void {
    if (this.windowService.getStorage(IsFirstLogin) === 'false') {
      return;
    }
    this.windowService.setStorage(IsFirstLogin, 'false');
    
  }

  ngOnInit(): void {
    this.subTheme();
  }
}
