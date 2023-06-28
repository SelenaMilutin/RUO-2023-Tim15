import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { keys } from 'src/environments/keys';

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
    const user = JSON.parse(localStorage.getItem("user") || "")
    this.http.put(keys.apiGateway + "famillyInvitation", 
    {"callerUsername":user.username,
     "email": this.newMail,
    }
    , {headers: new HttpHeaders().set('Content-Type', 'application/json')})
    .subscribe(
      respoce => {
        console.log(respoce)
        alert(JSON.stringify(respoce))
      }
      )
  }

}
