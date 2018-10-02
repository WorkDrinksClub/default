import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { ToastService } from '../services/toast.service';
import { Member } from '../models/member';
import { Inventory } from '../models/inventory';
import { BehaviorSubject } from 'rxjs';

/*
 * Service that subscribes to all members. Members are keyed by email address. If the currently
 * authenticated user matches a member then this is stored in a dedicated me instance variable.
 * As memebrs are loaded an inventory is created. A special lost and found member exists which
 * is mapped into the inventory. This class is also responsible for all member CRUD operations
 * which include adding/inviting a new member, consuming, supplying and removing a member. It
 * reports the success / failure of such operations via a Toast service.
 */
@Injectable()
export class MemberService {

  private inventory: Inventory = new Inventory();
  private membersRef: AngularFirestoreCollection<Member>;
  private me: BehaviorSubject<Member> = new BehaviorSubject<Member>(null);
  private lostAndFound: BehaviorSubject<Member> = new BehaviorSubject<Member>(null);

  constructor(private afs: AngularFirestore, private toastService: ToastService) {
  }

  getMembers(email: string): Observable<Member[]> {
    // get the reference and then subscribe to real-time updates on the collection
    this.membersRef = this.afs.collection<Member>('members', ref => ref.orderBy('name', 'asc'));
    const members = this.membersRef.snapshotChanges().pipe().map(actions => {
      // need to clear out the inventory and this is calculated on every update
      this.inventory.reset();
      return actions.map(action => {
        const data = action.payload.doc.data() as Member;
        // the id is actually the email
        const id = action.payload.doc.id;
        let current = { id, ...data };
        // update the inventory for this member
        if (email == id) {
          console.log("Found me - " + data.name);
          this.me.next(current);
        } else if (id == "lostAndFound") {
          this.lostAndFound.next(current);
        }
        this.inventory.addConsumed(data.consumed);
        this.inventory.addSupplied(data.supplied);
        return current;
      });
    });
    return members;
  }

  addMember(name: string, email: string) {
    // this isn't really needed as there is full form validation, here for completeness
    if (name == null || name.trim().length == 0 || email == null || email.trim().length == 0) {
      console.log("Invalid name " + name + " and/or email " + email);
      this.toastService.presentToast("Please supply valid name and email");
      return;
    }
    let member = new Member(name, 0, 0);
    var data = JSON.parse(JSON.stringify(member));
    // set the key of the document to the email so that we can lookup
    // the user from the authorisation rules and lock down the app.
    this.membersRef.doc(email).set(data).then((data: any) => {
      this.toastService.presentToast("Added member " + name);
    }).catch(error => {
      this.toastService.presentToast("Failed to add member " + name);
    });
  }

  public updateMember(member: any, plusConsumed: number, plusSupplied: number) {
    // unfortunately the html input fields are returning strings
    // even when the input type is number, in addition angular 
    // firebase doesn't like typed objects so assemble JSON here
    let newJSON: any = {
      name: member.name,
      consumed: member.consumed + Number(plusConsumed),
      supplied: member.supplied + Number(plusSupplied)
    }
    console.log("Updating " + JSON.stringify(newJSON));
    this.membersRef.doc(member.id).update(newJSON).then((data: any) => {
      this.toastService.presentToast("Updated member " + member.name);
    }).catch(error => {
      this.toastService.presentToast("Failed to update member");
    });
  }

  removeMember(member: Member) {
    this.membersRef.doc(member.id).delete().then((data: any) => {
      this.toastService.presentToast("Deleted member " + name);
    }).catch(error => {
      this.toastService.presentToast("Failed to delete member " + member.name);
    });
  }

  public getInventory(): Inventory {
    return this.inventory;
  }

  public getMe(): Observable<Member> {
    return this.me;
  }

  public getLostAndFound(): Observable<Member> {
    return this.lostAndFound;
  }

  consume(member: Member) {
    this.supplyConsume(member, false, { consumed: member.consumed + 1 })
  }

  supply(member: Member) {
    this.supplyConsume(member, true, { supplied: member.supplied + 1 })
  }

  private supplyConsume(member: Member, supplied: boolean, update: any) {
    let updateString = (supplied ? "supplied" : "consumed");
    console.log("SupplyConsume [" + updateString + "]: " +
      JSON.stringify(member) + " - " + JSON.stringify(update));
    this.membersRef.doc(member.id).update(update).then((data: any) => {
      this.toastService.presentToast(member.name + " just " + updateString);
    }).catch(error => {
      this.toastService.presentToast("Failed to update " + updateString + " for " + member.name);
    });
  }
}
