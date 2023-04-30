import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as AWS from 'aws-sdk';
import { keys } from 'src/environments/keys';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
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
      TableName: "users_the_second_great_table",
    };
    
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
      }
    });
  }
}
