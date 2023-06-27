function createResponse(status, body) {
    return { 
        statusCode: status, 
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:4200',
        },
        body: JSON.stringify(body, null, 2)
    };
}

module.exports = {
    createResponse
};