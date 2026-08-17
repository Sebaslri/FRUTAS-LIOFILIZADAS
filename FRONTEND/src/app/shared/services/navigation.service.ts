import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  NavigationDropdown,
  NavigationItem,
  NavigationLink,
  NavigationSubheading,
} from '../interfaces/navigation-item.interface';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navigationItems: NavigationItem[] = [
    {
      type: 'link',
      label: 'Educación Consumidor',
      route: '/educacion',
      icon: 'school'
    },
    {
      type: 'link',
      label: 'Condiciones',
      route: '/condiciones',
      icon: 'medical_information',
    },
    {
      type: 'link',
      label: 'Mapa bioactivo',
      route: '/mapa-bioactivo',
      icon: 'map',
    },
    {
      type: 'link',
      label: 'Perfil sensorial',
      route: '/perfil-sensorial',
      icon: 'psychology',
    },
    {
      type: 'link',
      label: 'Comparador de frutas',
      route: '/comparador-frutas',
      icon: 'compare_arrows',
    },
    {
      type: 'link',
      label: 'Calculadora de preparación',
      route: '/calculadora-preparacion',
      icon: 'local_drink',
    },
    {
      type: 'link',
      label: 'Infusiones Funcionales',
      route: '/infusiones-funcionales',
      icon: 'emoji_food_beverage'
    },
    {
      type: 'link',
      label: 'Laboratorio de Mixes',
      route: '/creacion-mixes',
      icon: 'science'
    },
    {
      type: 'link',
      label: 'Referencias Bibliográficas',
      route: '/referencias-bibliograficas',
      icon: 'library_books'
    }
  ];

  get items(): NavigationItem[] {
    return this.navigationItems;
  }

  private readonly openChangeSubject = new Subject<NavigationDropdown>();
  readonly openChange$ = this.openChangeSubject.asObservable();

  setItems(items: NavigationItem[]) {
    this.navigationItems = items;
  }

  triggerOpenChange(item: NavigationDropdown) {
    this.openChangeSubject.next(item);
  }

  isLink(item: NavigationItem): item is NavigationLink {
    return item.type === 'link';
  }

  isDropdown(item: NavigationItem): item is NavigationDropdown {
    return item.type === 'dropdown';
  }

  isSubheading(item: NavigationItem): item is NavigationSubheading {
    return item.type === 'subheading';
  }
}
