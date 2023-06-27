const AWS = require('aws-sdk');

// Kreiranje instance klijenta za pristup DynamoDB-u
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const clientToken = event.authorizationToken || event.headers.Authorization; // Do something with an incoming auth token
  console.log(clientToken)

  const active = true; // Do something to check if user is active or similar

  const policy = active ? 'Allow' : 'Deny';
  console.log(`Is user active? ${active}`);

  const response = JSON.stringify({
    something: "It's something"
  });

  return generatePolicy('user', policy, event.methodArn, response);
};

async function validateToken(user) {
  return false;
}

const generatePolicy = (principalId, effect, resource, data) => {
  // @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
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

  authResponse.context = {
    stringKey: JSON.stringify(data)
    //role: user.role --> "principalId" could be an object that also has role
  };

  console.log('authResponse', authResponse);

  return authResponse;
};