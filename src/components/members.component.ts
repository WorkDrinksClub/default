import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Member } from '../models/member';
import { MemberService } from '../services/firestore.member.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from 'ionic-angular';

/*
 * Subscribe to the members and provide an interface to the member service for CRUD
 * operations
 */
@Component({
  selector: 'members',
  templateUrl: 'members.component.html'
})
export class MembersComponent {

  // used by model, explicitly null for *ngIf
  showMembers: boolean = true;
  members: Observable<Member[]> = null;

  constructor(private authService: AuthService, private memberService: MemberService,
    private alertCtrl: AlertController) {

    this.authService.getAuthenticatedUser().subscribe(user => {
      if (user != null) {
        this.members = memberService.getMembers(user.email);
      } else {
        this.members = null;
      }
    });
  }

  consume(member: Member) {
    console.log("Consume: " + JSON.stringify(member));
    this.memberService.consume(member);
  }

  supply(member: Member) {
    console.log("Supply: " + JSON.stringify(member));
    this.memberService.supply(member);
  }

  removeMember(member: Member) {
    let alert = this.alertCtrl.create({
      title: "Remove Member?",
      message: "Do you want to remove " + member.name + "'s membership?",
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Remove',
        handler: () => {
          console.log('Removing ' + JSON.stringify(member));
          this.memberService.removeMember(member);
        }
      }
      ]
    });
    alert.present();
  }

  toggleMembers() {
    // collapses / expands details html form
    this.showMembers = !this.showMembers;
  }
}
