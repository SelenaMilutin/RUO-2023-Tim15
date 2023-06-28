import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Album } from 'src/app/models/models';
import { keys } from 'src/environments/keys';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  constructor(private readonly http: HttpClient) { 
    AWS.config.update({ region: 'eu-central-1',
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.secretKey });
  }

  private apiUrl = 'https://9ln7bu8pi2.execute-api.eu-central-1.amazonaws.com'
  private stagePath = '/dev';
  private resourcePath = '/album';
  private url = this.apiUrl + this.stagePath + this.resourcePath;


  public getSubAlbums(s3link: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post(this.url, {
        s3Link: s3link,
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

  public createAlbum(s3link: string, newAlbumName: string): Promise<Album[]> {

    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/create', {
        s3Link: s3link,
        newAlbumName: newAlbumName
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
