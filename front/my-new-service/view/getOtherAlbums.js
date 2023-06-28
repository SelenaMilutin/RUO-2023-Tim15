const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.get = async (event, context) => {

    var body = JSON.parse(event.body)

    var s3Link = body.s3Link
    var fileOwner = body.fileOwner

    var params = {
        TableName: 'serverlessAlbums',
        FilterExpression: 'fileOwner = :fileOwner AND s3Link <> :s3Link',
        ExpressionAttributeValues: {
            ':fileOwner': fileOwner,
            ':s3Link': s3Link
        },
        ProjectionExpression: 's3Link, fileOwner'
    }

    try {
        const data = await docClient.scan(params).promise();
        const albumNames = data.Items.map(album => album.s3Link);
        if (data.Items.length > 0) return createResponse(200, {body: albumNames});
        else return createResponse(200, {body: []});    } 
    catch (error) {
        console.error('Error:', error);
        return createResponse(500, 'Error');
    }

}
  