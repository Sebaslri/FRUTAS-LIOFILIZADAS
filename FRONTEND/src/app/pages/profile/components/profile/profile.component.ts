import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UserProfile } from '../../models/profile.interface';
import { AuthService } from '../../../auth-pages/services/auth.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { MaterialModule } from '../../../../shared/material.module';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);

  profile: UserProfile | null = null;
  isLoading = true;
  isSaving = false;

  // Modifiable fields
  editNombre = '';
  editApellido = '';
  editFoto = '';

  backendUrl = environment.api;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;

    // Primero intentamos cargar desde localStorage
    const localUser = this.authService.getCurrentUser();
    if (localUser) {
      this.profile = {
        usuarioId: localUser.usuarioId || localUser.id || 0,
        nombre: localUser.nombre || '',
        apellido: localUser.apellido || '',
        email: localUser.email || localUser.correo || '',
        foto: localUser.foto || ''
      };
      this.editNombre = this.profile.nombre;
      this.editApellido = this.profile.apellido;
      this.editFoto = this.profile.foto || '';
    }

    this.profileService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profile = response.data;
          this.editNombre = this.profile.nombre;
          this.editApellido = this.profile.apellido;
          this.editFoto = this.profile.foto || '';

          // Actualizar auth state con la info más reciente del servidor
          const currentUser = this.authService.getCurrentUser() || {};
          this.authService.updateCurrentUser({ ...currentUser, ...response.data });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar perfil desde servidor:', err);
        if (!this.profile) {
          this.alertService.error('Error', 'No se pudo cargar el perfil');
        }
        this.isLoading = false;
      }
    });
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

  saveProfile() {
    if (!this.editNombre.trim() || !this.editApellido.trim()) {
      this.alertService.warn('Atención', 'El nombre y apellido son obligatorios');
      return;
    }

    this.isSaving = true;

    const formData = new FormData();
    formData.append('usuarioId', this.profile?.usuarioId.toString() || '');
    formData.append('nombre', this.editNombre);
    formData.append('apellido', this.editApellido);

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    } else {
      formData.append('foto', this.editFoto); // keep existing URL if no new file
    }

    this.profileService.updateProfile(formData as any).subscribe({
      next: (response: any) => {
        this.isSaving = false;
        if (response.success || response.isSuccess) {
          this.alertService.success('¡Éxito!', 'Perfil actualizado correctamente');
          // Update the local profile state
          if (this.profile) {
            this.profile.nombre = this.editNombre;
            this.profile.apellido = this.editApellido;
            if (response.data?.foto) {
              this.profile.foto = response.data.foto;
              this.editFoto = response.data.foto;
              this.previewUrl = null;
              this.selectedFile = null;
            }
          }

          // Actualizar estado global y localStorage
          const currentUser = this.authService.getCurrentUser() || {};
          const updatedUser = {
            ...currentUser,
            nombre: this.editNombre,
            apellido: this.editApellido,
            foto: this.editFoto
          };
          this.authService.updateCurrentUser(updatedUser);

        } else {
          this.alertService.error('Error', response.message || 'No se pudo actualizar el perfil');
        }
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        this.alertService.error('Error', 'Ocurrió un error al actualizar tu perfil');
        this.isSaving = false;
      }
    });
  }
}
