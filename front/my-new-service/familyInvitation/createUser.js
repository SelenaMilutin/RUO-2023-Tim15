const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports.createUser= async (event, context) => {
    var snsparams = {
        Message: 'User successfully created',
        Subject: 'Tim15 registration notification',
        TopicArn: 'arn:aws:sns:eu-central-1:260436118818:DatabaseTopic'
      };

    var params = {
        TableName: "serverlessUsersByInvitation",
        Key: {
          "username": { 
              S: `${event.username}` 
          }
        },
        ConditionExpression: 'attribute_exists(username)'
    };

    try {
        const data = await docClient.get(params).promise()
        if (JSON.stringify(data.Item) != null) {
            user = data.Item
      } else {return {error: ""}}
    } catch(err){return {error: err}}


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
   
    
  } catch(err) {return {error: err}}

    docClient.deleteItem(params, async function(err, data) {
        // error
        if (err) {
            console.log(err);
            return {error: err}
            //callback(err);
        }
        // successful delete
        else {
            console.log(`Data for user ${userid} successfully deleted`);
            console.log(data);
            try {
                const data = await sns.publish(snsparams).promise();
              } catch (e) {
                console.log(e.stack)
                    return "AAAAAAAAAAAAAAAAa"
            
              }
            return{data: `Successfully Created user`}
            //callback(null, `Data for user ${event.userid} successfully deleted`);
        }
    });
}