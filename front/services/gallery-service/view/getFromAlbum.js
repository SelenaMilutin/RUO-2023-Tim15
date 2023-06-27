const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.get = async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    return createResponse(400, event)
    const queryParams = event.queryStringParameters;
    if (!queryParams) {
        return createResponse(400, 'Invalid request.')
    }
    const { albumName, hasAccess } = event.queryStringParameters;

    var params = {
        TableName: 'gst-serverlessGallery',
        KeyConditionExpression: 'albumName = :albumNameVal and hasAccess = :hasAccessVal',
        ExpressionAttributeValues: {
        ':albumNameVal': albumName,
        ':hasAccessVal': hasAccess
        },
        ProjectionExpression: 'albumName, hasAccess'
    }
    

    try {
        const data = await docClient.query(params).promise();
        const result = data.Items; 
        result.forEach(item => {
            console.log(item.fileName + ',' + item.albumName + ',' + item['hasAccess']); 
        });
        createResponse(200, {body: data.Items});
    } catch (error) {
        console.error('Error:', error);
        return createResponse(400, 'Error');
    }

}
  