const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.uploadDDB= async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))

    var file = event

    var object = {
    TableName: 'serverlessGallery',
    Item: {
      "fileName": {
      "S": file.fileName
      },
      "fileType": {
      "S": file.fileType
      },
      "fileSize": {
      "S": file.fileSize
      },
      "dateCreated": {
      "S": file.dateCreated
      },
      "dateModified": {
      "S": file.dateModified
      },
      "description": {
      "S": file.description
      },
      "tags": {
      "L": file.tags
      },
      "owner": {
        "S": file.owner
      },
      "albumName": {
        "S": file.albumName
      }
    }
  };

  try {
    await docClient.put(object).promise();
    return { body: 'Successfully created item!' }
  } catch (err) {
    return { error: err }
  }

}
  