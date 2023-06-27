import { HttpClient, HttpParams } from '@angular/common/http';
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

    this.params = new HttpParams();
  }

  // private apiUrl = 'https://rjew6scp3nw5juocb3f3p537ke0ovvhp.lambda-url.eu-central-1.on.aws';
  private apiUrl = ' https://b3tlrppjub.execute-api.eu-central-1.amazonaws.com/testStage1/gallery-service-dev-getFromAlbum'
  // private stagePath = '/dev';
  // private resourcePath = '/view';
  private params: HttpParams;



  private loggedInUser: string = "mico"

  loadFiles(albumName: string): Promise<GalleryFile[]> {

    this.params = new HttpParams();
    this.params.set('albumName', albumName)
    this.params.set('hasAccess', this.loggedInUser)
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl, {params: this.params}).subscribe(
        (response: any) => {
          console.log(response)
          if (response.statusCode != 200) resolve([])
          const parsedResponse: GalleryFile[] = JSON.parse(response.body);
          console.log(parsedResponse)
          resolve(parsedResponse);
        },
        (error) => {
          reject(error);
        }
      );
    })
  }

}
