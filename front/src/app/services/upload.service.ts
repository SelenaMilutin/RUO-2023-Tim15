import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk'
import * as S3 from 'aws-sdk/clients/s3';
import { keys } from 'src/environments/keys';
import { DinamoDBdataService } from './dinamo-dbdata.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private readonly dinamoBDservice: DinamoDBdataService) { }

  
  uploadFile(file: any, albumName: string) : boolean {
    AWS.config.update({region: 'eu-central-1',
                      apiVersion: "2012-08-10",
                      accessKeyId: keys.accessKey,
                      secretAccessKey: keys.secretKey});
                      
    const bucket = new S3(
          {
              apiVersion: '2006-03-01',
              accessKeyId: keys.accessKey,
              secretAccessKey: keys.secretKey,
              region: 'eu-central-1'
          }
      );

    const contentType = file.type;
    const params = {
        Bucket: 'milostim15.gallery',
        Key: albumName + '-' + file.name,
        Body: file,
        ACL: 'public-read',
        ContentType: contentType
    };
    const that = this;
    
    bucket.upload(params, function (err: any, data: any) {
      if (err) {
        console.log('Error S3', err);
        return false;
      }
        console.log('Success S3', data);
        that.saveToDynamoDB(file, albumName);
        return true;
    });
    return true;
  }

async saveToDynamoDB(file: any, albumName: string): Promise<void> {
  // Load the AWS SDK for Node.js
  // Set the region 
  AWS.config.update({region: 'eu-central-1',
                    apiVersion: "2012-08-10",
                    accessKeyId: keys.accessKey,
                    secretAccessKey: keys.secretKey});

  // Create the DynamoDB service object
  var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  console.log(file.size)
  let owner = localStorage.getItem('user')
  if (owner == undefined) owner = "mico"
  var params = {
    TableName: 'files_registry',
    Item: {
      "fileName": {
       "S": file.name
      },
      "fileType": {
       "S": file.type
      },
      "fileSize": {
       "S": file.size.toString()
      },
      "dateCreated": {
       "S": new Date().toISOString()
      },
      "dateModified": {
       "S": new Date().toISOString()
      },
      "description": {
       "S": ""
      },
      "tags": {
       "L": []
      },
      "owner": {
        "S": owner
      },
      "albumName": {
        "S": albumName
      }
     }
  };
  const that = this
  // // Call DynamoDB to add the item to the table
  ddb.putItem(params, function(err: any, data: any) {
    if (err) {
      console.log("Error DDB", err);
    } else {
      console.log("Success DDB", data);
    }
  });

  }
}
