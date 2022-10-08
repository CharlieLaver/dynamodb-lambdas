const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'}); 

exports.handler = async (event) => {
	
	// Log environment variables & event
	console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
	console.info("EVENT\n" + JSON.stringify(event, null, 2));
	
	return ddb.scan({
		TableName: 'artscapy_evaluation_table',
	}).promise();
};