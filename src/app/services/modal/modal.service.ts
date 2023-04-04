import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _isOpen = new BehaviorSubject<boolean>(false);
  public get isOpen() {
    return this._isOpen.asObservable();
  }
  constructor() {}

  open() {
    this._isOpen.next(true);
  }
  close() {
    this._isOpen.next(false);
  }
}
