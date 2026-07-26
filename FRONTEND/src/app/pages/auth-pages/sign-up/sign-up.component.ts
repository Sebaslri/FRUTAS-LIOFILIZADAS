import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../../../shared/material.module';
import Swal from 'sweetalert2';
import { CustomTitleService } from '../../../shared/services/custom-title.service';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../shared/animations/page.animations';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MaterialModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  inputType = "password";
  visible = false;
  isLoading = false;

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private _customTitle: CustomTitleService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this._customTitle.set("Registro")
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  register(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      formData.append(key, this.form.value[key]);
    });

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this._authService.register(formData).pipe(finalize(() => this.isLoading = false)).subscribe((resp) => {
      if (resp.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: resp.message,
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/educacion']);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Algo Ocurrió',
          text: resp.message,
          confirmButtonText: 'OK',
        })
      }
    });
  }

  toggleVisibility(): void {
    this.visible = !this.visible;
    this.inputType = this.visible ? "text" : "password";
    this.cd.markForCheck();
  }

  goBack(): void {
    this.router.navigate(["/"]);
  }

  goToSignUp(): void {
    this.router.navigate(["/signup"]);
  }
}
