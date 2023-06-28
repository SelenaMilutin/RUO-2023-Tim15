import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { keys } from 'src/environments/keys';

@Component({
  selector: 'app-verify-registration',
  templateUrl: './verify-registration.component.html',
  styleUrls: ['./verify-registration.component.css']
})
export class VerifyRegistrationComponent implements OnInit {

  constructor(private readonly http: HttpClient) { }

  ngOnInit(): void {
  }

  verify() {
    const user = JSON.parse(localStorage.getItem("user") || "")
    const params = new HttpParams().set("", "")
    this.http.put(keys.apiGateway + "user", 
    {
      "email": "sele@gmail.com",
      "callerUsername": user.username
    }
    , {headers: new HttpHeaders().set("content-type", "application/json")})
    .subscribe(
      respoce => {
        console.log(respoce)
        alert(JSON.stringify(respoce))
      }
      )
   
  }


}
