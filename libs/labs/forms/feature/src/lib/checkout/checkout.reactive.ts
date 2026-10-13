import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LabCouponResult } from '@portfolio/contracts';
import { catchError, map, of, switchMap, timer } from 'rxjs';

/** Regra entre campos em Reactive Forms: um validador no grupo, e não no campo. */
const emailsMatch: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null =>
  group.get('email')?.value === group.get('confirmEmail')?.value
    ? null
    : { emailsDiffer: true };

// #region forms-reactive-form
/** O mesmo formulário de checkout com Reactive Forms, para comparar com a versão em Signal Forms. */
export class CheckoutReactiveForm {
  private readonly http = inject(HttpClient);

  readonly checkout = new FormGroup(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      confirmEmail: new FormControl('', { nonNullable: true }),
      quantity: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.min(1), Validators.max(10)],
      }),
      coupon: new FormControl('', {
        nonNullable: true,
        asyncValidators: [this.couponValidator()],
      }),
    },
    { validators: [emailsMatch] },
  );

  /**
   * O timer faz o debounce e, como o Angular se desinscreve da validação anterior quando o valor
   * muda, o switchMap cancela a consulta que ainda estava no ar.
   */
  private couponValidator(): AsyncValidatorFn {
    return (control) => {
      const code = String(control.value).trim();
      if (!code) return of(null);
      return timer(400).pipe(
        switchMap(() =>
          this.http.get<LabCouponResult>(
            `api/lab/coupon?code=${encodeURIComponent(code)}`,
          ),
        ),
        map((result) => (result.valid ? null : { couponInvalid: true })),
        catchError(() => of({ couponUnavailable: true })),
      );
    };
  }
}
// #endregion
