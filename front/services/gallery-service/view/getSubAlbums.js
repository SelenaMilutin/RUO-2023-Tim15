const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.get = async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))

    // const queryParams = event.queryStringParameters;
    // if (!queryParams) {
    //     return createResponse(400, 'Invalid request.')
    // }
    // const { albumName, hasAccess } = event.queryStringParameters;

    var s3link = body.s3link

    var params = {
        TableName: 'gst-serverlessAlbums',
        KeyConditionExpression: '#hashKey = :hashKeyValue',
        ExpressionAttributeNames: {
          '#hashKey': 's3link',
        },
        ExpressionAttributeValues: {
          ':hashKeyValue': s3link,
        },
        ProjectionExpression: 'albumName, s3link, subAlbums'
    }

    try {
        const data = await docClient.query(params).promise();
        return createResponse(200, {body: data.Items});
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, 'Error');
    }

}
  