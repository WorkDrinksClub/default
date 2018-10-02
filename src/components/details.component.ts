import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Member } from '../models/member';
import { MemberService } from '../services/firestore.member.service';

@Component({
  selector: 'user-details',
  templateUrl: 'details.component.html'
})
/**
 * Show and provide more control of the logged in users name, supplied
 * and consumed data
 */
export class DetailsComponent implements OnInit {

  // used by model (html), so default protection to avoid lint issues
  details: Member;
  original: Member;
  plusConsumed: number = 0;
  plusSupplied: number = 0;
  detailsForm: FormGroup;

  private showDetails: boolean = false;

  constructor(private formBuilder: FormBuilder, private memberService: MemberService) {
    // all work happening in ngOnInit as per recommendations
  }

  ngOnInit() {
    console.log("Subscribing to user details...");
    this.memberService.getMe().subscribe(data => {
      // seem to have received some not fully initialised data on
      // the callbacks which needs some investigation, in the
      // meantime protect against things and log out
      if (data != null) {
        this.plusConsumed = 0;
        this.plusSupplied = 0;
        this.details = data;
        // cache the current values so that we can 'cancel' out of the form
        this.original = new Member(data.name, data.supplied, data.consumed);
        // validation for each of the form groups done here
        this.detailsForm = this.formBuilder.group({
          name: [this.details.name, [Validators.required,
          Validators.minLength(2), Validators.maxLength(20)]],
          consumed: [this.details.consumed, Validators.required],
          supplied: [this.details.supplied, Validators.required],
        });
      }
    });
  }

  saveDetails() {
    this.memberService.updateMember(this.details, this.plusConsumed, this.plusSupplied);
    this.toggleDetails();
  }

  consume(value: Member) {
    // increment consumed by 1 and save
    this.memberService.consume(value);
  }

  toggleDetails() {
    // collapses / expands details html form
    this.showDetails = !this.showDetails;
    // reset to the original values
    this.details.name = this.original.name;
    this.plusConsumed = 0;
    this.plusSupplied = 0;
  }
}
