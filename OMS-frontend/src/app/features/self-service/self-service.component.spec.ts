import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfServiceComponent } from './self-service.component';

describe('SelfServiceComponent', () => {
  let component: SelfServiceComponent;
  let fixture: ComponentFixture<SelfServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelfServiceComponent]
    });
    fixture = TestBed.createComponent(SelfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
