import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceunavailableComponent } from './serviceunavailable.component';

describe('ServiceunavailableComponent', () => {
  let component: ServiceunavailableComponent;
  let fixture: ComponentFixture<ServiceunavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceunavailableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceunavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
