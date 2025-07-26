import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsettingComponent } from './viewsetting.component';

describe('ViewsettingComponent', () => {
  let component: ViewsettingComponent;
  let fixture: ComponentFixture<ViewsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewsettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
