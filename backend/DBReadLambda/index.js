const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'}); 

exports.handler = async () => {
    return ddb.scan({
        TableName: 'artscapy_evaluation_table',
    }).promise();
};