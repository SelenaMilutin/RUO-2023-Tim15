import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invite-family',
  templateUrl: './invite-family.component.html',
  styleUrls: ['./invite-family.component.css']
})
export class InviteFamilyComponent implements OnInit {

  constructor(private readonly http: HttpClient) { }
  newMail: String = ""

  ngOnInit(): void {
  }

  sendInvitation(): void {
    this.http.put(" ", 
    {"callerUsername": "ucitaj ime",
      "callerEmail": "",
     "email": this.newMail,
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
