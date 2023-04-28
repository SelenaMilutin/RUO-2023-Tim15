/// <reference types="aws-sdk" />
import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as AWS from 'aws-sdk'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() { }

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
    this.loadtobase()
  }

  loadtobase(): void {
    // Load the AWS SDK for Node.js
    // Set the region 
    AWS.config.update({region: 'Frankfurt',
                      apiVersion: "2010-12-01",
                      accessKeyId: "process.env.AWS_SECRET_KEY"});
                      // accessSecretKey: "process.env.AWS_SECRET_KEY"});
  
    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  
    var params = {
      TableName: 'users_the_second_great_table',
      Item: {
        "username": {
         "S": this.registerAccountForm.value.username
        },
        "galeryName": {
         "S": "root"
        },
        "document": {
         "L": [
         ]
        },
        "name": {
         "S": this.registerAccountForm.value.name
        },
        "lastname": {
         "S": this.registerAccountForm.value.lastname
        },
        "birthday": {
         "S": this.registerAccountForm.value.birthday
        },
        "email": {
         "S": this.registerAccountForm.value.gmail
        },
        "password": {
         "S": this.registerAccountForm.value.password
        }
       }
    };
  
    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err: any, data: any) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  
  }
  
}

