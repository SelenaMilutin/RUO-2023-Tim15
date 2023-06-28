const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;

module.exports.getAlbumsOrFiles = async (event, context) => {
        
  const body = JSON.parse(event.body)
  const sub = body.sub
  const type = body.type
  let table = ""
  let attr = ""
  
  console.log(sub)
  console.log(type)

  if (type == "ALBUM") {
    table = "serverlessAlbums"
    attr = "s3Link"
  }
  else if (type == "FILE") {
    table = "serverlessGallery"
    attr = "s3Name"
  }
  
  console.log(table)
  console.log(attr)

  try {
    
    const params = {
      TableName: table,
      FilterExpression: "begins_with(" + attr + ", :sub)",
      ExpressionAttributeValues: {
        ':sub': sub
      },
    };

    const result = await docClient.scan(params).promise();
    
    return createResponse(200, result.Items);     
  } catch (error) {
    return createResponse(500, error);
  }

}
  