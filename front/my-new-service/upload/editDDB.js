const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.edit = async (event, context) => {

    var file = JSON.parse(event.body);
    const now = new Date();

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
      "s3Name": file.s3Name,
      "albumName": file.albumName
    }
    
  };

  try {
    await docClient.put(object).promise();
    return createResponse(200, 'Successfully created item!');
  } catch (error) {
    return createResponse(500, error);
  }

}
  