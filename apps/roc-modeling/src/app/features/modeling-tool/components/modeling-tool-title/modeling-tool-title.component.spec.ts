import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelingToolTitleComponent } from './modeling-tool-title.component';

describe('ModelingToolTitleComponent', () => {
  let component: ModelingToolTitleComponent;
  let fixture: ComponentFixture<ModelingToolTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelingToolTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelingToolTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
