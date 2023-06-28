import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk'
import * as StepFunctions from "aws-sdk/clients/stepfunctions";
import { Observable } from 'rxjs';
import { keys } from 'src/environments/keys';
import { UploadRequest } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { 
    AWS.config.update({ region: 'eu-central-1',
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.secretKey });
  }

  private apiUrl = 'https://vqp4k2kqs3.execute-api.eu-central-1.amazonaws.com/dev/upload';

  private url = this.apiUrl;
  
  private response : any;
  
  async uploadFile(req: UploadRequest): Promise<any> {

    const promise = new Promise<any>((resolve) => {

      this.getArn(req).subscribe(async (res) => {
  
        this.waitForStepFunctionCompletion(res.executionArn)
        .then(() => {
          console.log('All steps in the Step Function have completed.');
          resolve(this.response);
        })
        .catch((_: Error) => {
          console.log('Failed to wait for Step Function completion.');
          resolve(this.response);
        });
  
      })

    });

    return promise;
    
    
  }
  
  getArn(req: UploadRequest): Observable<any> {
    return this.http.post<UploadRequest>(this.url, req)
  }
  
  async waitForStepFunctionCompletion(executionArn: string): Promise<void> {
    const stepFunctions = new StepFunctions();
    const params: StepFunctions.DescribeExecutionInput = {
      executionArn,
    };
  
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const response = await stepFunctions.describeExecution(params).promise();
  
          if (response.status === 'RUNNING') {
            setTimeout(checkStatus, 2000); // Check again after 2 seconds
          } else if (response.status === 'SUCCEEDED') {
            const responseBody = response.output ? JSON.parse(response.output) : {};
            console.log(responseBody);
            if (responseBody.statusCode == 200) this.response = responseBody.body
            else if (responseBody.statusCode == 400) this.response = responseBody.body
            else this.response = "Error"
            resolve();
          } else {
            reject(new Error('Error'));
          }
        } catch (error) {
          reject(new Error('Error'));
        }
      };
      checkStatus();
    });
  }

}
