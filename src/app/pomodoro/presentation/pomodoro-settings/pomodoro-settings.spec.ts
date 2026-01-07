import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroSettings } from './pomodoro-settings';

describe('PomodoroSettings', () => {
  let component: PomodoroSettings;
  let fixture: ComponentFixture<PomodoroSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PomodoroSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PomodoroSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
