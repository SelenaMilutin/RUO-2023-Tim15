const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.delete = async (event, context) => {
        
  const body = JSON.parse(event.body)
  const albumName = body.s3Link

  const params = {
    TableName: 'serverlessAlbums',
    Key: {
      s3Link: albumName
    },
    ReturnValues: null
  }

  try {
    const data = await docClient.delete(params).promise()
    return createResponse(200, "successfully deleted album " + albumName);  
  } catch (error) {
    return createResponse(200, error);  
  }

}
  