import { Member } from "./member";

/*
* Encapsulates a change. The type can be insert, delete or update. For
* insert and delete then newValues will be null, for update this will be non=
* null.
*/
export class Change {

  insertTime: Date;
  member: Member;
  type: string;
  newValues: Member;

  constructor() {
  }
}
