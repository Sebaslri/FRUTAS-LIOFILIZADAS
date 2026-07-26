import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class CustomTitleService {
  
  
  constructor(private title: Title) {}

  set(title: string): void {
    this.title.setTitle(`${title} | AppFrutas UAE`);
  }
}
