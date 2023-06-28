const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.get = async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))

    var body = JSON.parse(event.body)
    var s3Link = body.s3Link
    var fileOwner = body.fileOwner

    var params = {
        TableName: 'serverlessAlbums',
        FilterExpression: 'fileOwner = :owner AND s3Link <> :link',
        ExpressionAttributeValues: {
            ':fileOwner': fileOwner,
            ':link': s3Link
        },
        ProjectionExpression: 'albumName'
    }

    try {
        const data = await docClient.query(params).promise();
        const albumNames = data.Items.map(album => album.albumName);
        if (data.Items.length > 0) return createResponse(200, {body: albumNames});
        else return createResponse(200, {body: []});    } 
    catch (error) {
        console.error('Error:', error);
        return createResponse(500, 'Error');
    }

}
  