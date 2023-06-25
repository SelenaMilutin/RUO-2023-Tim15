const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.upload = async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))

    // Previous step has failed
    if (event.hasOwnProperty('statusCode')) return event;

    var file = event;

    var object = {
    TableName: 'serverlessGallery',
    Item: {
      "fileName": file.fileName,
      "fileType": file.fileType,
      "fileSize": file.fileSize,
      "dateCreated": file.dateCreated,
      "dateModified": file.dateModified,
      "description": file.description,
      "tags": file.tags,
      "owner": file.owner,
      "hasAccess": file.hasAccess,
      "s3Name": file.s3Name,
      "albumName": file.albumName
    }
    
  };

  try {
    await docClient.put(object).promise();
    return createResponse(200, 'Successfully created item!');
  } catch (error) {
    return createResponse(400, 'Error');
  }

}
  