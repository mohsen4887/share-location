import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpen.asObservable();
  constructor() {}

  open() {
    this.isOpen.next(true);
  }
  close() {
    this.isOpen.next(false);
  }
}
