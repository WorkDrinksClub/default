import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MemberService } from '../services/firestore.member.service';

@Component({
  selector: 'add-user',
  templateUrl: 'add-user.component.html'
})
export class AddUser {

  private name: string;
  private email: string;
  private showAddUser: boolean = false;
  // used by the model in html so default protection
  inviteForm: FormGroup;
  private readonly emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(private formBuilder: FormBuilder, private memberService: MemberService) {
    this.inviteForm = this.formBuilder.group({
      name: ["", [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      email: ["", [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }

  addUser() {
    console.info("Adding member: " + this.name + ", email: " + this.email);
    this.memberService.addMember(this.name, this.email.toLowerCase());
    this.toggleAddUserForm();
  }

  toggleAddUserForm() {
    this.showAddUser = !this.showAddUser;
    this.name = "";
    this.email = "";
  }
}
