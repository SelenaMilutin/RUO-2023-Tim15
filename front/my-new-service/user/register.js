const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports.registerUser= async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    var snsparams = {
        Message: 'User successfully created',
        Subject: 'Tim15 registration notification',
        TopicArn: 'arn:aws:sns:eu-central-1:260436118818:DatabaseTopic'
      };
    var user = event
    const params = {
  TableName : 'serverlessUsers',
  /* Item properties will depend on your application concerns */
  Key: {
    username: user.username
  }
}
try {
    const data = await docClient.get(params).promise()
    if (JSON.stringify(data.Item) != null) {
       try {
    snsparams.Message = "User already exists"
    const data = await sns.publish(snsparams).promise();
  } catch (e) {
    console.log(e.stack)
        return "AAAAAAAAAAAAAAAAa"

  } finally {
      return {error: "User already exists!"}
    
  }
  
    }
    var userparams = {
        TableName: 'serverlessUsers',
        Item: {
          "username": user.username,
          "namee": user.name,
          "lastname": user.surname,
          "birthday": user.birthday,
          "email": user.email,
          "password":user.password
         }
      };
      try {
    await docClient.put(userparams).promise();
    try {
    const data = await sns.publish(snsparams).promise();
  } catch (e) {
    console.log(e.stack)
        return "AAAAAAAAAAAAAAAAa"

  } finally {
    return { body: 'Successfully created item!' }
    
  }
  } catch (err) {
    
    return { error: err }
  }
  } catch (err) {
    return { error: err }
  }
}
  
