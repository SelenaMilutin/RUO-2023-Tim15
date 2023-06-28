const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.post = async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))

    var body = JSON.parse(event.body)
    var s3Link = body.s3Link
    var newAlbumName = body.newAlbumName
    if (newAlbumName.includes('/')) return createResponse(400, 'Invalid request.');

    var object = {
        TableName: 'serverlessAlbums',
        Item: {
          "s3Link": s3Link+'/'+newAlbumName,
          "albumName": newAlbumName,
          "subAlbums": []
      }
    }

    const params = {
      TableName: 'serverlessAlbums',
      Key: {
        s3Link: s3Link
      },
      UpdateExpression: 'SET subAlbums = list_append(if_not_exists(subAlbums, :emptyList), :newItem)',
      ConditionExpression: 'NOT contains(subAlbums, :checkItem)',
      ExpressionAttributeValues: {
      ':emptyList': [],
      ':newItem': [s3Link + '/' + newAlbumName],
      ':checkItem': s3Link + '/' + newAlbumName,
      },
    };
    console.log(params)
    try {
      await docClient.update(params).promise();
      await docClient.put(object).promise();
      return createResponse(200, 'Successfully created item!');
    } catch (error) {
      console.log(error)
       if (error.code === 'ConditionalCheckFailedException') {
         return createResponse(400, 'Sub album with given name already exists.')
       }
      return createResponse(500, 'Error');
    }
  
}
  