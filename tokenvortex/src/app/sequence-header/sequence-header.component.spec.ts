import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceHeaderComponent } from './sequence-header.component';

describe('SequenceHeaderComponent', () => {
  let component: SequenceHeaderComponent;
  let fixture: ComponentFixture<SequenceHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
