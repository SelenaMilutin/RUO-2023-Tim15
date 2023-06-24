const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.test= async(event, context) => {
    var user = event;
    console.log(ddb)
    var params = {
        TableName: 'serverlessUsers',
        Item: {
          "username": "aaa",
          "namee": "aaa",
          "lastname": "aaa",
          "birthday": "aaa",
          "email": "aaa",
          "password":"aaa"
         }
      };
      try {
    await docClient.put(params).promise();
    return { body: 'Successfully created item!' }
  } catch (err) {
    
    return { error: err }
  }

};