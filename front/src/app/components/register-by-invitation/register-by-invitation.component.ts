import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-by-invitation',
  templateUrl: './register-by-invitation.component.html',
  styleUrls: ['./register-by-invitation.component.css']
})
export class RegisterByInvitationComponent implements OnInit {

  constructor(private readonly http: HttpClient,
    private router: Router) { }

registerAccountForm: FormGroup = new FormGroup({
name: new FormControl('', Validators.required),
surname: new FormControl('', Validators.required),
birthday: new FormControl('', Validators.required),
email: new FormControl('', [Validators.email, Validators.required]),
username: new FormControl('', Validators.required),
password: new FormControl('', Validators.required),
confirmPassword: new FormControl('', Validators.required),
callerUsername:  new FormControl('', Validators.required)
})

ngOnInit(): void {
}

registerAccount(): void {
if (!this.registerAccountForm.valid){
alert("Podaci")
return
}
if (this.registerAccountForm.value.password != this.registerAccountForm.value.confirmPassword) {
alert("Lozinke nisu iste")
return
}
// this.addWithService()
this.doRegister()
}

doRegister() {
const params = new HttpParams().set("", "")
this.http.post(" ", 
{"username": this.registerAccountForm.value.username,
"name": this.registerAccountForm.value.name,
"surname": this.registerAccountForm.value.surname,
"birthday": this.registerAccountForm.value.birthday,
"email": this.registerAccountForm.value.email,
"password": this.registerAccountForm.value.password,
"callerUsername": this.registerAccountForm.value.callerUsername
}
, {headers: new HttpHeaders().set("content-type", "application/json")})
.subscribe(
respoce => {
console.log(respoce)
alert(respoce)
}
)

}


}

