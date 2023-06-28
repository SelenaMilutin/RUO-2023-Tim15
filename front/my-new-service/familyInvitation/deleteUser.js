const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.delete= async (event, context) => {
    var params = {
        TableName: "serverlessUsersByInvitation",
        Key: {
          "username": { 
              S: `${event.username}` 
          }
        },
        ConditionExpression: 'attribute_exists(username)'
    };

    docClient.deleteItem(params, function(err, data) {
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
            return{data: `Data for user ${event.userid} successfully deleted`}
            //callback(null, `Data for user ${event.userid} successfully deleted`);
        }
    });
}