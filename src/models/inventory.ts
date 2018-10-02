/*
* Encapsulates what's been supplied and what's been consumed allow us
* to therefore calculate what we have available
*/
export class Inventory {

  // set explicity as used by model
  supplied: number = 0;
  consumed: number = 0;

  constructor() {
  }

  public reset() {
    this.supplied = 0;
    this.consumed = 0;
  }

  public addConsumed(value: number) {
    this.consumed += value;
  }

  public addSupplied(value: number) {
    this.supplied += value;
  }
}