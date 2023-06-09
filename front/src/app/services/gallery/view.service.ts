import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Album, GalleryFile, ViewRequest } from 'src/app/models/models';
import { keys } from 'src/environments/keys';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(private http: HttpClient) { 
    AWS.config.update({ region: 'eu-central-1',
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.secretKey });

    this.params = new HttpParams();
  }

  // private apiUrl = 'https://rjew6scp3nw5juocb3f3p537ke0ovvhp.lambda-url.eu-central-1.on.aws';
  private apiUrl = keys.apiGateway
  private resourcePath = 'view';
  private url = this.apiUrl +  this.resourcePath;
  private params: HttpParams;

  private loggedInUser: string = ''

  public loadFiles(albumName: string): Promise<GalleryFile[]> {

    return new Promise((resolve, reject) => {
      this.http.post(this.url, {
        albumName: albumName,
        hasAccess: "milos" // TODO
      }).subscribe(
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
