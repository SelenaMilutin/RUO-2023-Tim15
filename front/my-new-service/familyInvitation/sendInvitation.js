const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const ses = new AWS.SES({region: 'eu-central-1'});


module.exports.sendInvitation= async (event, context) => {
  var user = JSON.parse(event.body);
  const snsparams = {
        Message: 'you have been invited by' + event.callerUsername + "register on http://localhost:4200/registerByInvitation",
        Subject: 'Tim15 registration notification',
        TopicArn: 'arn:aws:sns:eu-central-1:260436118818:DatabaseTopic'
      };
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    
    sendMail("Tim15 registration notification", "you have been invited by " + user.callerUsername + " register on http://localhost:4200/registerByInvitation")
    
    var userparams = {
        TableName: 'serverlessUsersByInvitation',
        Item: {
          "email": user.email,
          "callerUsername":user.callerUsername
                 }
      };
      try {
    await docClient.put(userparams).promise();
    try {
    const data = await sns.publish(snsparams).promise();
  } catch (e) {
    console.log(e.stack)

  } finally {
    return {
    statusCode: 200,
    headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
    body: JSON.stringify("Success")
}
    
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
  
