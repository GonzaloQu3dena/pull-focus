import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'danger' | 'outline' | 'ghost';

@Component({
  selector: 'app-custom-btn',
  imports: [],
  templateUrl: './custom-btn.html',
  styleUrl: './custom-btn.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex',
    '[class.w-full]': 'fullWidth()',
  },
})
export class CustomBtn {
  /**
   * Input to disable the button.
   */
  disabled = input<boolean>(false);
  /**
   * Input to set the button to full width.
   */
  fullWidth = input<boolean>(false);
  /**
   * Input to set the button variant.
   */
  variant = input<ButtonVariant>('primary');
  /**
   * Input to set the button type.
   */
  type = input<'button' | 'submit' | 'reset'>('button');

  /**
   * Output to emit when the button is clicked.
   */
  btnClick = output<void>();

  /**
   * Method to handle the button click.
   */
  protected handleClick(): void {
    if (!this.disabled()) {
      this.btnClick.emit();
    }
  }
}
