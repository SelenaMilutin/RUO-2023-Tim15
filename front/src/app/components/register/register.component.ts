/// <reference types="aws-sdk" />
import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AWS from 'aws-sdk'
import { bool } from 'aws-sdk/clients/signer';
import { DinamoDBdataService } from 'src/app/services/dinamo-dbdata.service';
import { keys } from 'src/environments/keys';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private readonly dinamoBDservice: DinamoDBdataService,
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
    this.userExsists()
  }
  userExsists(): any {
    AWS.config.update({region: 'eu-central-1',
                      apiVersion: "2012-08-10",
                      accessKeyId: keys.accessKey,
                      secretAccessKey: keys.secretKey});

    let ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
    let params = {
      // Specify which items in the results are returned.
      FilterExpression: "username = :u OR email = :p",
      // Define the expression attribute value, which are substitutes for the values you want to compare.
      ExpressionAttributeValues: {
        ":u": {S: this.registerAccountForm.value.username || ""},
        ":p": {S: this.registerAccountForm.value.email || ""}
      },
      // Set the projection expression, which are the attributes that you want.
      ProjectionExpression: "username",
      TableName: "users",
    };
    let status: boolean = true
    ddb.scan(params, (err, data) => {
      if (err) {
        console.log("Error", err);
        alert("Neuspesna konekcija")
      } else {
        if (data.Items?.length == 0) {
          this.loadtobase()
          return
        }
        alert("Krisnicko ime zauzeto")
      }
    });
    return status
  }
  addWithService() {
    this.dinamoBDservice.create({
      name: this.registerAccountForm.value.name,
      lastname: this.registerAccountForm.value.surname,
      birthday: this.registerAccountForm.value.birthday,
      username: this.registerAccountForm.value.username,
      email: this.registerAccountForm.value.email,
      password: this.registerAccountForm.value.password,
      galleries: []
    }).subscribe((nesto:any)=>
    {
      console.log(nesto);
    })
  }

  async loadtobase(): Promise<void> {
    // Load the AWS SDK for Node.js
    // Set the region 
    AWS.config.update({region: 'eu-central-1',
                      apiVersion: "2012-08-10",
                      accessKeyId: keys.accessKey,
                      secretAccessKey: keys.secretKey});
  
    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  
    var params = {
      TableName: 'users',
      Item: {
        "username": {
         "S": this.registerAccountForm.value.username
        },
        "namee": {
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
    const that = this
    // // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err: any, data: any) {
      if (err) {
        console.log("Error", err);
        alert("Greska pri upisivanju")
      } else {
        console.log("Success", data);
        alert("Napravljen nalog. Ulogujte se")
        
        that.router.navigate(['/']);
      }
    });
  }
  
}

