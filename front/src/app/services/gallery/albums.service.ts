import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Album, GalleryFile } from 'src/app/models/models';
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

  private apiUrl = keys.apiGateway;
  private resourcePath = 'album';
  private url = this.apiUrl + this.resourcePath;


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
        newAlbumName: newAlbumName,
        hasAccess: JSON.parse(localStorage.getItem('user')!).username,
        fileOwner: JSON.parse(localStorage.getItem('user')!).username
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

  public getOtherAlbums(s3link: string): Promise<any> {
    
    console.log("asd" + JSON.parse(localStorage.getItem('user')!).username)
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/getOtherAlbums', {
        s3Link: s3link,
        fileOwner: JSON.parse(localStorage.getItem('user')!).username
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

  public moveFile(file: GalleryFile, newName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/move', {
        fileName: file.fileName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        dateCreated: file.dateCreated,
        dateModified: file.dateModified,
        description: file.description,
        tags: file.tags,
        fileOwner: file.fileOwner,
        hasAccess: file.hasAccess,
        s3Name: file.s3Name,
        albumName: file.albumName,
        newName: newName
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
