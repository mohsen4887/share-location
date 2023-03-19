import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal/modal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  isOpen$: Observable<boolean>;
  constructor(private modalService: ModalService) {
    this.isOpen$ = this.modalService.isOpen$;
  }

  closeModal() {
    this.modalService.close();
  }
}
