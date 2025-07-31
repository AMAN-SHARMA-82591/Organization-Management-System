import { Component, Input } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme/theme.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  constructor(public themeService: ThemeService) {}
  @Input() tabsData: { name: string; path: string }[] | undefined;
}
