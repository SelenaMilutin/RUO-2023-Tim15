const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.getAlbums = async (event, context) => {
        const data = JSON.parse(event.body)
        const params = {
            TableName: 'serverlessAlbums',
            FilterExpression: 'username = :username and password = :password',
            ExpressionAttributeValues: {
              ':username': body.username,
              ':password': body.password
            },
            ProjectionExpression: "username, namee, lastname, email"
          };
        
          try {
            const data = await docClient.scan(params).promise()
            return {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Origin": "http://localhost:4200",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              },
              body: JSON.stringify({ body: data.Items }) 
            }
          } catch (err) {
            return {
              statusCode: 500,
              headers: {
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Origin": "http://localhost:4200",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
              },
              body: JSON.stringify({ error: err})
            }
          }

}
  