import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs';
import { keys } from 'src/environments/keys';
import { json } from 'stream/consumers';
import { saveAs } from 'file-saver';

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

  login(): void {

    const params = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }

    this.http.post('https://prb40jtsz0.execute-api.eu-central-1.amazonaws.com/dev/login', params).subscribe((response: any) => {
      
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
  }

  login2(): void {
    
    
  }

  download(): void {
    const params = {
      fileName: "folder1/CachedImage_1920_1080_POS3.jpg"
    }

    this.http.post('https://prb40jtsz0.execute-api.eu-central-1.amazonaws.com/dev/download', params).subscribe((response: any) => {
      console.log(response)
      
      let bytes = new Uint8Array(response!.body.data)
      const blob = new Blob([bytes], { type: 'application/octet-stream' });
      saveAs(blob, "file." + params.fileName.split("\.")[1]);

    });
  }
}
