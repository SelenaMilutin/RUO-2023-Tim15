const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports.createUser= async (event, context) => {
  var user = JSON.parse(event.body);
    var snsparams = {
        Message: 'User successfully created',
        Subject: 'Tim15 registration notification',
        TopicArn: 'arn:aws:sns:eu-central-1:260436118818:DatabaseTopic'
      };
    
    const params2 = {
        TableName : 'serverlessUsersByInvitation',
        /* Item properties will depend on your application concerns */
        Key: {
          email: user.email
        }
      }
      try {
          const data = await docClient.get(params2).promise()
          if (JSON.stringify(data.Item) == null) {
            return {
  statusCode: 404,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify("This request does not exist!")
}
            }
        var user = data.Item
        var userparams = {
        TableName: 'serverlessUsers',
        Item: {
          "username": user.username,
          "namee": user.namee,
          "lastname": user.lastname,
          "birthday": user.birthday,
          "email": user.email,
          "password":user.password
         }
      };
      try {
    sendMail("Tim15 registration notification", "You have been registered")
    await docClient.put(userparams).promise();
   
    
  } catch(err) {return {error: err}}

      } catch(err){}



    
      var params = {
  TableName: 'serverlessUsersByInvitation',
  /* Item properties will depend on your application concerns */
  Key: {
    email: user.email
  },
  ReturnValues: null
}

    try {
    const data = await docClient.delete(params).promise()
    return {
  statusCode: 200,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify("Nalog created successfully!")
}
  } catch (err) {
    return {
  statusCode: 404,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify(err)
}
  }
}

async function sendMail(subject, data) {

  const emailParams = {
        Destination: {
          ToAddresses: ["selena.milutin@gmail.com"],
        },
        Message: {
          Body: {
            Text: { Data: data },
          },
          Subject: { Data: subject },
        },
        Source: "selena.milutin@gmail.com",
  };
      
  try {
        let key = await ses.sendEmail(emailParams).promise();
        console.log("MAIL SENT SUCCESSFULLY!!");      
  } catch (e) {
        console.log("FAILURE IN SENDING MAIL!!", e);
      }  
  return;
}