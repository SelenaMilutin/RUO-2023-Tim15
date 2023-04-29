import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { User } from 'aws-sdk/clients/budgets';
import { Observable } from 'rxjs';
import { AppUser } from '../models/models';
import { keys } from 'src/environments/keys';

@Injectable({
  providedIn: 'root'
})
export class DinamoDBdataService {
private dynamodb;
private docClient;
private params = {
    TableName: 'users_the_second_great_table'
};
private readObs = Observable.create((observer: { error: (arg0: AWS.AWSError) => void; next: (arg0: AWS.DynamoDB.DocumentClient.AttributeMap[]) => void; }) => {
    this.docClient.scan(this.params, (err, data) => {
    if (err) {
        observer.error(err);
    } else {
        // observer.next(data.Items.map(item => {
        // item.release_date = new Date(item.release_date);
        // return item;
        // }));
    }
    });
});

constructor() {
    // provide your access key and secret access key as obtained in the previous step
    AWS.config.credentials = new AWS.Credentials(keys.accessKey, keys.secretKey);
    AWS.config.update({
    region: 'frankfurt'
    });

    this.dynamodb = new AWS.DynamoDB();
    this.docClient = new AWS.DynamoDB.DocumentClient();
}

public getItems(): Observable<any[]> {
    return this.readObs;
}

public create(user:AppUser): Observable<any[]> {

    const params = {
    TableName: 'users_the_second_great_table',
    Item: {
      "username": {
       "S": user.username
      },
      "galeryName": {
       "S": "root"
      },
      "document": {
       "L": [
       ]
      },
      "name": {
       "S": user.name
      },
      "lastname": {
       "S": user.lastname
      },
      "birthday": {
       "S": user.birthday
      },
      "email": {
       "S": user.email
      },
      "password": {
       "S": user.password
      }
     }
    };

    return Observable.create((observer: { error: (arg0: AWS.AWSError) => void; next: (arg0: AppUser) => void; }) => {
    this.docClient.put(params, (err, data) => {
        if (err) {
        observer.error(err);
        } else {
        observer.next(user);
        }
    });
    });
}

public save(user:AppUser, isNew:boolean) {

    if (isNew) {
    return this.create(user);
    }

    return this.update(user);
}

private update(user:AppUser) {
    const updateArray = [];
    const updateArrtibutes:any = {};

    const updated = Object.assign({}, user, { release_date: user.name.toString }); // serialize the JavaScript Date Object

    for (const property in updated) {
    if (updated.hasOwnProperty(property) && property !== 'id') {
        updateArray.push(`${property} = :${property}`);
        // updateArrtibutes[`:${property}`] = updated[property];
    }
    }

    const updateExpression = `set ${updateArray.join(',')}`;

    const params = {
    TableName: 'users_the_second_great_table',
    Key: {
        id: user.username
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: updateArrtibutes,
    ReturnValues: 'ALL_NEW'
    };

    return Observable.create((observer: { error: (arg0: AWS.AWSError) => void; next: (arg0: AppUser) => void; }) => {
    this.docClient.update(params, (err, data) => {
        if (err) {
        observer.error(err);
        } else {
        observer.next(user);
        }
    });
    });
}

public remove(item:AppUser) {
    const params = {
    TableName: 'Movies',
    Key: {
        id: item.username
    },
    ReturnValues: 'ALL_OLD'
    };

    return Observable.create((observer: { error: (arg0: AWS.AWSError) => void; next: (arg0: number) => void; }) => {
    this.docClient.delete(params, (err, data) => {
        if (err) {
        observer.error(err);
        } else {
        observer.next(200);
        }
    });
    });
}
}