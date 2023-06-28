const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.get = async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))

    var body = JSON.parse(event.body)
    var s3Link = event.body.s3Link
    var s3Link = body.s3Link

    var params = {
        TableName: 'serverlessAlbums',
        KeyConditionExpression: '#hashKey = :hashKeyValue',
        ExpressionAttributeNames: {
          '#hashKey': 's3Link',
        },
        ExpressionAttributeValues: {
          ':hashKeyValue': s3Link,
        },
        ProjectionExpression: 'albumName, s3Link, subAlbums'
    }

    try {
        const data = await docClient.query(params).promise();
        return createResponse(200, {body: data.Items[0]});
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, 'Error');
    }

}
  