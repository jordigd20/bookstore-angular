import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';

@Component({
  selector: 'app-stepper-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CdkStepperModule,
  ],
  providers: [{ provide: CdkStepper, useExisting: StepperCheckoutComponent }],
  templateUrl: './stepper-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperCheckoutComponent extends CdkStepper {}
