const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {

  const active = event.body != undefined

  const policy = active ? 'Allow' : 'Deny'
  console.log(`Is user active? ${active}`)

  return generatePolicy('user', policy, event.methodArn);
};

async function validateToken(token) {
  
  const user = JSON.parse(token)
  
  const params = {
    TableName: 'serverlessUsers',
    FilterExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': user.username
    },
    ProjectionExpression: "username, namee, lastname, email"
  };
  
  try {
    const data = await docClient.scan(params).promise()
    console.log(data)
    
    if (data.Items.length == 1)
      return true
    else
      return false
      
  } catch (err) {
    return false
  }
  
}

const generatePolicy = (principalId, effect, resource) => {
  
  const authResponse = {
    principalId
  };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: []
    };

    const statement = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
    };

    policyDocument.Statement[0] = statement;
    authResponse.policyDocument = policyDocument;
  }

  console.log('authResponse', authResponse);

  return authResponse;
};