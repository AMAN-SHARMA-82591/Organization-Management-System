import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
})
export class TooltipComponent {
  @Input()
  tooltipText!: string;
  showTooltip: boolean = false;

  onEnter() {
    this.showTooltip = true;
  }

  onLeave() {
    this.showTooltip = false;
  }
}
