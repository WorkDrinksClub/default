import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { Change } from '../models/change';

/*
 * Service that subscribes to changes in a Firebase audit table
 */
@Injectable()
export class ChangesService {

  private dbRef: AngularFirestoreCollection<Change>;

  constructor(private afs: AngularFirestore) {
  }

  getChanges(): Observable<Change[]> {
    // get the reference and then subscribe to real-time updates on the collection
    this.dbRef = this.afs.collection<Change>('audit', ref => ref.orderBy('insertTime', 'desc').limit(50));
    let changes = this.dbRef.snapshotChanges().pipe().map(actions => {
      return actions.map(action => {
        return action.payload.doc.data() as Change;
      });
    });
    return changes;
  }
}
