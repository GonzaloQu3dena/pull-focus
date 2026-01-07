import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsStore } from '../../application/settings.store';
import { CustomBtn } from '@shared/presentation/components/custom-btn/custom-btn';
import { MainLayout } from '../../../core/layouts/main-layout/main-layout';

@Component({
  selector: 'app-pomodoro-settings',
  imports: [ReactiveFormsModule, CustomBtn, MainLayout],
  templateUrl: './pomodoro-settings.html',
  styleUrl: './pomodoro-settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroSettings implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(SettingsStore);
  private router = inject(Router);

  settingsForm: FormGroup = this.fb.group({
    focusDuration: [25, [Validators.required, Validators.min(1)]],
    shortBreakDuration: [5, [Validators.required, Validators.min(1)]],
    longBreakDuration: [15, [Validators.required, Validators.min(1)]],
    roundInterval: [4, [Validators.required, Validators.min(1)]],
    autoStart: [false],
  });

  ngOnInit(): void {
    const current = this.store.settings();
    this.settingsForm.patchValue({
      focusDuration: current.focusDuration,
      shortBreakDuration: current.shortBreakDuration,
      longBreakDuration: current.longBreakDuration,
      roundInterval: current.roundInterval,
      autoStart: current.autoStart,
    });
  }

  save(): void {
    if (this.settingsForm.valid) {
      this.store.updateSettings(this.settingsForm.value);
      this.router.navigate(['/pomodoro']);
    }
  }

  cancel(): void {
    this.router.navigate(['/pomodoro']);
  }

  toggleAutoStart(): void {
    const current = this.settingsForm.get('autoStart')?.value;
    this.settingsForm.patchValue({ autoStart: !current });
  }
}
