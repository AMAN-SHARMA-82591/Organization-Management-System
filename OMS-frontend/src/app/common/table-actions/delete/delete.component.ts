import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
})
export class DeleteComponent {
  @Input() messsage?: string = 'Are you sure ?';
  @Input() confirmText?: string = 'Confirm';
  @Input() cancelText?: string = 'Cancel';
  @Input()
  id!: string;
  @Input()
  onConfirm!: Function;

  isModalOpen: boolean = false;

  handleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  handleConfirm() {
    this.onConfirm(this.id);
  }
}
