const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const snsparams = {
        Message: 'you have been invited by' + event.callerUsername + "register on https://localhost:4200/registerByInvitation",
        Subject: 'Tim15 registration notification',
        TopicArn: 'arn:aws:sns:eu-central-1:260436118818:DatabaseTopic'
      };

module.exports.sendInvitation= async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    
    }
    var userparams = {
        TableName: 'serverlessUsersByInvitation',
        Item: {
          "email": event.email,
          "callerUsername":event.callerUsername
                 }
      };
      try {
    await docClient.put(userparams).promise();
    try {
    const data = await sns.publish(snsparams).promise();
  } catch (e) {
    console.log(e.stack)

  } finally {
    return { body: 'Successfully created request!' }
    
  }
  } catch (err) {
    
    return { error: err }
  }