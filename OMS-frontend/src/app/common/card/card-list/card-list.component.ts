import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
})
export class CardListComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() teams_data:
    | {
        name: string;
        EmployeeID: string;
        image: string;
        status: string;
      }[]
    | undefined;
  getLength() {
    const teams_data_length: number | undefined = this.teams_data?.length;
    return teams_data_length;
  }
  ngOnInit(): void {}
}
