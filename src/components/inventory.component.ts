import { Component } from '@angular/core';
import { Inventory } from '../models/inventory';
import { MemberService } from '../services/firestore.member.service';
import { AuthService } from '../services/auth.service';
import { Member } from '../models/member';

/*
 * Manages and interfaces inventory with member service
 */
@Component({
  selector: 'inventory',
  templateUrl: 'inventory.component.html'
})
export class InventoryComponent {

  // used by model, explicitly null for *ngIf
  inventory: Inventory = null;
  lostAndFound: Member = null;
  showInvDetails: boolean = false;

  constructor(private authService: AuthService, private memberService: MemberService) {

    this.authService.getAuthenticatedUser().subscribe(user => {
      this.inventory = this.memberService.getInventory();
    });
    this.memberService.getLostAndFound().subscribe(user => {
      this.lostAndFound = user
    });
  }

  consume(member: Member) {
    console.log("LostAndFound consumed: " + JSON.stringify(member));
    this.memberService.consume(member);
  }

  supply(member: Member) {
    console.log("LostAndFound supplied: " + JSON.stringify(member));
    this.memberService.supply(member);
  }

  toggleInvDetails() {
    // collapses / expands details html form
    this.showInvDetails = !this.showInvDetails;
  }
}
