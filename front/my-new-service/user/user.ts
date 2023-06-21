export interface AppUser {
    name: string
    lastname: string
    birthday: string
    username: string
    email: string
    password: string
    galleries: Gallery[]
}
export interface Gallery {
    name: string
    documents: Document[]
}

export interface Document {
    name: string
    type: string
    size: number
    creationDate: string
    lastChangeDate: string
    description: string
    tag: string
}

module.exports.registerUser= async (event: any, context: any) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    var AWS = require("aws-sdk")

    var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
    var user:AppUser = event['rawPath'][1]

    let params = {
      // Specify which items in the results are returned.
      FilterExpression: "username = :u OR email = :p",
      // Define the expression attribute value, which are substitutes for the values you want to compare.
      ExpressionAttributeValues: {
        ":u": {S: user.username || ""},
        ":p": {S: user.email || ""}
      },
      // Set the projection expression, which are the attributes that you want.
      ProjectionExpression: "username",
      TableName: "users",
    };
    let status: boolean = true
    ddb.scan(params, (err:any, data:any) => {
      if (err) {
        console.log("Error", err);
        alert("Neuspesna konekcija")
        var body = {
            'err': 'neuspela konekcija'
            }
        return { 'statusCode': 500, 'body': body }
      } else {
        if (data.Items?.length == 0) {
          
            var params = {
                TableName: 'users',
                Item: {
                  "username": {
                   "S": user.username
                  },
                  "namee": {
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
              ddb.putItem(params, function(err: any, data: any) {
                if (err) {
                  console.log("Error", err);
                  alert("Greska pri upisivanju")
                  
                  return { 'statusCode': 400, 'body': {'err':'Greska pri upisivanju'} }
                } else {
                  console.log("Success", data);
                  alert("Napravljen nalog. Ulogujte se")
                  var body = {
                    'data': user
                    }
                  return { 'statusCode': 200, 'body': body }
            
                  
                }
              });
          return
        }
        alert("Krisnicko ime zauzeto")
        return { 'statusCode': 400, 'body': {'err':'Krisnicko ime zauzeto'} }
      }
    });
    return status
  }
  

