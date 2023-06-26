import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { GalleryFile, ViewRequest } from 'src/app/models/models';
import { keys } from 'src/environments/keys';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(private http: HttpClient) { 
    AWS.config.update({ region: 'eu-central-1',
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.secretKey });
  }

  private apiUrl = 'https://kpl48b9aki.execute-api.eu-central-1.amazonaws.com';
  private stagePath = '/dev';
  private resourcePath = '/view';

  private url = this.apiUrl + this.stagePath + this.resourcePath;

  private loggedInUser: string = "mico"

  loadFiles(albumName: string): Promise<GalleryFile[]> {
    const payload: ViewRequest = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ''
      },
      body: {
        albumName: albumName,
        hasAccess: this.loggedInUser
      }
    }; 
    return new Promise((resolve, reject) => {
      this.http.get(this.url, payload).subscribe(
        (response: any) => {
          resolve(response.body);
        },
        (error) => {
          reject(error);
        }
      );
    })
  }

}
