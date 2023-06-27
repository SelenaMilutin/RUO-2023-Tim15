const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports.userFillsData= async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    var snsparams = {
        Message: 'User by email' + event.email + " filled his data. Confirm his registration by clicking on link.",
        Subject: 'Tim15 registration notification',
        TopicArn: 'arn:aws:sns:eu-central-DRUGITIPIC'
      };
    var user = event
    if (!isCorrectData(user)) {
      return {error: "Data not correct"}
    }
    // let paramsForInvitation = {
    //   TableName : 'serverlessUsersByInvitation',
    //   /* Item properties will depend on your application concerns */
    //   Key: {
    //     username: user.username
    //   }
    // }
    // try {
    //     const data = await docClient.get(paramsForInvitation).promise()
    //     if (JSON.stringify(data.Item) != null){ return {error: "This username is already taken!"}}
    // } catch(err){}


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
            return {error: "This username is already taken!"}
        }
try {
  let paramsForCheckingSender = {
    // Specify which items in the results are returned.
    FilterExpression: "email = :u AND callerUsername = :p",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ":u": {S: event.email || ""},
      ":p": {S: event.callerUsername || ""}
    },
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: "username, password, lastname, birthday",
    TableName: "users",
  };
    const data = await docClient.scan(paramsForCheckingSender).promise()
    if (JSON.stringify(data.Items) == null) {
      return {error: "This user did not invite you"}
    }
      
        try {
            const data = await sns.publish(snsparams).promise();
          } catch (e) {
            console.log(e.stack)
        
          } finally {
            var userparams = {
              TableName: 'serverlessUsersByInvitation',
              Item: {
                "username": user.username,
                "callerUsername":user.callerUsername,
                "namee": user.name,
                "lastname": user.surname,
                "birthday": user.birthday,
                "email": user.email,
                "password":user.password
               }
            };
            try {
          await docClient.put(userparams).promise();
          
          return { body: 'Successfully sent verifivation!' }
          
        }catch (err) {
          return { error: err }
      }
            
          }

        } catch (err) {
            return { error: err }
        }
    
  } catch (err) {
    return { error: err }
  }
}

function isCorrectData(user) {
  if (user.username == "" || user.name == "" || user.surname == "" || user.birthday == "" || user.email == "" || user.password == ""){
    return false
  }
  return true
}
  
