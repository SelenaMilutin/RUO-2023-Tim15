/// <reference types="aws-sdk" />
import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as AWS from 'aws-sdk'
import { keys } from 'src/environments/keys';
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

  async loadtobase(): Promise<void> {
    // Load the AWS SDK for Node.js
    // Set the region 
    AWS.config.update({region: 'Frankfurt',
                      apiVersion: "2012-08-10",
                      accessKeyId: keys.accessKey,
                      secretAccessKey: keys.secretKey});
  
    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var ddb2 = new AWS.DynamoDB.DocumentClient();

  
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
         "S": this.registerAccountForm.value.surname
        },
        "birthday": {
         "S": this.registerAccountForm.value.birthday
        },
        "email": {
         "S": this.registerAccountForm.value.email
        },
        "password": {
         "S": this.registerAccountForm.value.password
        }
       }
    };
  
    // // Call DynamoDB to add the item to the table
    // ddb.putItem(params, function(err: any, data: any) {
    //   if (err) {
    //     console.log("Error", err);
    //   } else {
    //     console.log("Success", data);
    //   }
    // });

    //drugi pokusaj
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        
      body = await ddb2.put(params).promise();
        
    } catch (err:any) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    } 
  }
  
}

