const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.move = async (event, context) => {

    console.log(event)
    // Previous step has failed
    if (event.hasOwnProperty('statusCode')) return event;

    var file = event['body'];
    const now = new Date();

    const key = {
        primaryKey: file.s3Name,
    };
    const params = {
        TableName: serverlessGallery,
        Key: key
    };

    try {
        await docClient.delete(params).promise();
    } catch (error) {
        console.log(error)
        return createResponse(500, 'Error');
    }

    var object = {
        TableName: 'serverlessGallery',
        Item: {
        "fileName": file.fileName,
        "fileType": file.fileType,
        "fileSize": file.fileSize,
        "dateCreated": file.dateCreated,
        "dateModified": now.toISOString(),
        "description": file.description,
        "tags": file.tags,
        "fileOwner": file.owner,
        "hasAccess": file.hasAccess,
        "s3Name": file.newName,
        "albumName": file.albumName
    }
    
  };

  try {
    await docClient.put(object).promise();
    return createResponse(200, 'Successfully moved item!');
  } catch (error) {
    console.log(error)
    return createResponse(500, 'Error');
  }

}
  