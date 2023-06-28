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

    var body = JSON.parse(event.body)
    var albumName = body.albumName
    var hasAccess = body.hasAccess

    var params = {
        TableName: 'serverlessGallery',
        FilterExpression: 'albumName = :albumNameVal and hasAccess = :hasAccessVal',
        ExpressionAttributeValues: {
        ':albumNameVal': albumName,
        ':hasAccessVal': hasAccess
        },
        ProjectionExpression: 'albumName, hasAccess, s3Name, dateCreated, dateModified, description, fileName, fileOwner, fileSize, fileType, tags'
    }

    try {
        const data = await docClient.scan(params).promise();
        return createResponse(200, {body: data.Items});
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, 'Error');
    }

}
  