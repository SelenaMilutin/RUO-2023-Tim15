import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs';
import { keys } from 'src/environments/keys';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private readonly router:Router, private http: HttpClient) { }

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
  }

  login2(): void {
    const headers = new HttpHeaders().set('Authorization', "neko");
    console.log(this.loginForm.value.username)

    const params = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    this.http.post('https://6t8binv3ld.execute-api.eu-central-1.amazonaws.com/dev/login', params).subscribe((response: any) => {
      
      let items: any = response!.body

      if (items.length == 0) {
        alert("Nema korisnika sa tim kredencijalima")
        return
      }

      if (items.length > 1) {
        alert("Ima vise od jednog korisnika sa tim kredencijalima")
        return
      }

      let user: any = items[0]
      localStorage.setItem("user", JSON.stringify(user))
      console.log(JSON.parse(localStorage.getItem("user")!))

    });

    // this.http.get('https://7wr536bm03.execute-api.eu-central-1.amazonaws.com/dev/funkcija').subscribe(response => {
    //   console.log("izvrseno")
    // });
  }

  login(): void {
    if (!this.loginForm.valid) {
      alert("Podaci")
      return
    }

    AWS.config.update({region: 'eu-central-1',
                      apiVersion: "2012-08-10",
                      accessKeyId: keys.accessKey,
                      secretAccessKey: keys.secretKey});

    let ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

    let params = {
      // Specify which items in the results are returned.
      FilterExpression: "username = :u AND password = :p",
      // Define the expression attribute value, which are substitutes for the values you want to compare.
      ExpressionAttributeValues: {
        ":u": {S: this.loginForm.value.username || ""},
        ":p": {S: this.loginForm.value.password || ""}
      },
      // Set the projection expression, which are the attributes that you want.
      ProjectionExpression: "username, password, lastname, birthday",
      TableName: "users",
    };
    let that = this
    ddb.scan(params, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
        if (data.Items?.length == 0) {
          alert("pogresni kredencijali")
          return
        }
        if (data.Items?.length != 1) {
          alert("ima vise naloga sa istim kredencijalima")
          return
        }
        // localStorage.setItem("user", JSON.stringify({
        //   "username": data.Items[0]["username"].S
        // }))
        localStorage.setItem("user", data.Items[0]["username"].S || "")
        that.router.navigate(['/upload']);
      }
    });
  }
}
