import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-header',
  templateUrl: './card-header.component.html',
})
export class CardHeaderComponent {
  @Input() totalMembers: Number | undefined;
}
