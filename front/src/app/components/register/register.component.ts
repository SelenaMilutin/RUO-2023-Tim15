/// <reference types="aws-sdk" />
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AWS from 'aws-sdk'
import { bool } from 'aws-sdk/clients/signer';
import { error } from 'console';
import { DinamoDBdataService } from 'src/app/services/dinamo-dbdata.service';
import { keys } from 'src/environments/keys';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private readonly http: HttpClient,
              private router: Router) { }

  registerAccountForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
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
    this.http.post(" https://2yqmqwkyhc.execute-api.eu-central-1.amazonaws.com/firstStage", 
    {"username": this.registerAccountForm.value.username,
     "name": this.registerAccountForm.value.name,
     "surname": this.registerAccountForm.value.surname,
     "birthday": this.registerAccountForm.value.birthday,
     "email": this.registerAccountForm.value.email,
     "password": this.registerAccountForm.value.password
    }
    , {headers: new HttpHeaders().set("content-type", "application/json")})
    .subscribe(
      respoce => {
        console.log(respoce)
      }
      )
   
  }

  
}

