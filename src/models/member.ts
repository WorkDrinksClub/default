/*
* Encapsulate the Member details. The id field is the document id in the
* Firebase real-time database collection and is typically the email addresss
*/
export class Member {

  id: string;
  name: string;
  supplied: number;
  consumed: number;

  constructor(name: string, supplied: number, consumed: number) {
    this.name = name;
    this.supplied = supplied;
    this.consumed = consumed;
  }
}