import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UIButtonComponent } from './uibutton.component';

describe('UIButtonComponent', () => {
  let component: UIButtonComponent;
  let fixture: ComponentFixture<UIButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UIButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UIButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
