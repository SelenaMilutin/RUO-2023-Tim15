const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.upload = async (event, context) => {
        // Previous step has failed
    if (event.hasOwnProperty('statusCode')) return event;

    var file = event['body'];
    const now = new Date();

    var object = {
    TableName: 'gst-serverlessGallery',
    Item: {
      "fileName": file.fileName,
      "fileType": file.fileType,
      "fileSize": file.fileSize,
      "dateCreated": now.toISOString(),
      "dateModified": now.toISOString(),
      "description": file.description,
      "tags": file.tags,
      "fileOwner": file.owner,
      "hasAccess": file.hasAccess,
      "s3Name": file.s3Name,
      "albumName": file.albumName
    }
    
  };

  try {
    await docClient.put(object).promise();
    return createResponse(200, 'Successfully created item!');
  } catch (error) {
    console.log(error)
    return createResponse(400, 'Error');
  }

}
  