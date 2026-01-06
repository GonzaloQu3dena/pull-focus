import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroView } from './pomodoro-view';

describe('PomodoroView', () => {
  let component: PomodoroView;
  let fixture: ComponentFixture<PomodoroView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PomodoroView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PomodoroView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
