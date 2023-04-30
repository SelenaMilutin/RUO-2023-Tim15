import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { keys } from 'src/environments/keys';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  
  
  uploadFile(file: any) : boolean {
    AWS.config.update({region: 'eu-central-1',
    apiVersion: "2012-08-10",
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.secretKey});
    const contentType = file.type;
    const bucket = new S3(
          {
              apiVersion: '2006-03-01',
              accessKeyId: keys.accessKey,
              secretAccessKey: keys.secretKey,
              region: 'eu-central-1'
          }
      );
      const params = {
          Bucket: 'milostim15.gallery',
          Key: file.name,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      bucket.upload(params, function (err: any, data: any) {
          if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
          }
          console.log('Successfully uploaded file.', data);
          return true;
      });
      return false;
}

}
