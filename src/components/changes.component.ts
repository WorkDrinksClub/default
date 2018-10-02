import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChangesService } from '../services/changes.service';
import { Change } from '../models/change';

@Component({
  selector: 'changes',
  templateUrl: 'changes.component.html'
})
/**
 * Show recent changes
 */
export class ChangesComponent {

  // used by model, explicitly null for *ngIf
  showChanges: boolean = false;
  changes: Observable<Change[]> = null;

  constructor(private authService: AuthService, private memberService: ChangesService) {
    this.authService.getAuthenticatedUser().subscribe(user => {
      this.changes = (user != null) ? this.memberService.getChanges() : null;
    });
  }

  toggleChanges() {
    // collapses / expands changes
    this.showChanges = !this.showChanges;
  }
}
