import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { ThemeService } from 'src/app/core/services/theme/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  showSidebar: Observable<boolean> = new Observable<boolean>();
  collapseShow = 'hidden';
  menuData = [
    {
      link: '/',
      title: 'Home',
      icon: 'fas fa-home',
      matchOption: { exact: true },
    },
    {
      link: '/organization',
      title: 'Organization',
      icon: 'fa-solid fa-building',
      matchOption: { exact: false },
    },
    {
      link: '/selfservice',
      title: 'Self Service',
      icon: 'fa-solid fa-person',
      matchOption: { exact: false },
    },
    {
      link: '/leavetracker',
      title: 'Leave Tracker',
      icon: 'fa-solid fa-person-walking-arrow-right',
      matchOption: { exact: false },
    },
  ];
  constructor(
    public themeService: ThemeService,
    public menuService: MenuService
  ) {
    this.showSidebar = this.menuService.showSidebar;
  }

  ngOnInit() {}
  toggleCollapseShow(classes: string) {
    this.collapseShow = classes;
    this.menuService.toggleResponsiveSidebar();
  }

  toggleSidebar() {
    this.menuService.toggleSidebar();
  }

  toggleTheme() {
    this.themeService.theme = !this.themeService.isDark ? 'dark' : 'light';
  }
}
