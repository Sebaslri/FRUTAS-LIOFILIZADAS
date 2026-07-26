import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../../../shared/material.module';
import { CustomTitleService } from '../../../shared/services/custom-title.service';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../shared/animations/page.animations';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  inputType = 'password';
  visible = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private _customTitle: CustomTitleService,
    private _alert: AlertService,
  ) {
    this.form = this.fb.group({
      email: ['d123@gmail.com', [Validators.required, Validators.email]],
      password: ['d123', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this._customTitle.set('Iniciar Sesión');
  }

  login(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => control.markAllAsTouched());
      this._alert.warn('Revisa tus datos', 'Ingresa un correo válido y una contraseña antes de continuar.');
      return;
    }

    this.isLoading = true;

    this._authService.login(this.form.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (resp) => {
          if (resp.success && resp.user) {
            this.router.navigate(['/educacion']);
            return;
          }

          this._alert.error('No se pudo iniciar sesión', resp.message || 'El correo o la contraseña no son correctos.');
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status === 401
            ? 'El correo o la contraseña no son correctos.'
            : error.error?.message || 'No se pudo conectar con el servicio de autenticación.';

          this._alert.error('No se pudo iniciar sesión', message);
        },
      });
  }

  toggleVisibility(): void {
    this.visible = !this.visible;
    this.inputType = this.visible ? 'text' : 'password';
    this.cd.markForCheck();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToSignUp(): void {
    this.router.navigate(['/signup']);
  }
}
