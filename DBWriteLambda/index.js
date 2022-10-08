const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

exports.handler = async (event, context, callback) => {
	
	// Log environment variables & event
	console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
	console.info("EVENT\n" + JSON.stringify(event, null, 2));
	
	if(event != null && event != undefined) {
		
		const postData = JSON.parse(event.body);
		const requestId = context.awsRequestId;
		let saveData = {id: requestId};
		let errors = [];
		
		// Validate all fields & remove any special chars (when not required) - to prevent XSS
		// If the data does not pass validation still save to db but just remove any security risks
		
		// Validate name
		if(postData.hasOwnProperty('name') && postData.name.length) {
			if(containsSpecialChars(postData.name)) {
				errors.push('Name contained special characters!');
			}
		saveData.name = removeSpecialChars(postData.name);
		}
		
		// Validate email
		if(postData.hasOwnProperty('email') && postData.email.length) {
			if(!isValidEmail(postData.email)) {
				errors.push('Email format is not valid!');
			}
			// Email's can only include RFC-compliant characters
			let unvalidEmailChars = new RegExp("[^-@._+~a-zA-Z0-9]", "g");
			if(postData.email.match(unvalidEmailChars)) {
				errors.push('Email contained unvalid special characters!');
			}
			// Remove any unvalid email chars (to prevent XSS)
			saveData.email = postData.email.replace(unvalidEmailChars,'');
		}
		
		// Validate age
		if(postData.hasOwnProperty('age') && postData.age) {
			if(Number.isInteger(parseInt(postData.age))) {
				if(postData.age < 0) {
					errors.push('Age is smaller than zero!');
				}
				saveData.age = postData.age;
			} else {
				saveData.age = removeSpecialChars(postData.age.toString());
				errors.push('Age is not of type int!');
			}
		}
		
		// Validate dob
		if(postData.hasOwnProperty('dob') && postData.dob) {
			if(Date.parse(postData.dob)) {
				saveData.dob = postData.dob;
			} else {
				errors.push('DOB was not a valid date!');
				saveData.dob = removeSpecialChars(postData.dob.toString());
			}
		}
		
		// Validate favouriteArtist
		if(postData.hasOwnProperty('favouriteArtist') && postData.favouriteArtist.length) {
			if(containsSpecialChars(postData.favouriteArtist)) {
				errors.push('favouriteArtist contained special characters!');
			}
		saveData.favouriteArtist = removeSpecialChars(postData.favouriteArtist);
		}
		
		if(postData.hasOwnProperty('newsletterSignup')) {
			saveData.newsletterSignup = postData.newsletterSignup ? true : false;
		}
		
		saveData.errors = errors;
		
		await dbWrite(saveData).then(() => {
			callback(null, {
				statusCode: 201,
				body: JSON.stringify({success:true}),
				headers: {
					'Access-Control-Allow-Origin' : '*'
				}
			});
		}).catch((err) => {
			callback(err);
		});
		
	} else {
		callback("Post data not valid!");
	}
	
};

// Inserts into database
const dbWrite = (saveData) => {
	const params = {
		TableName: 'artscapy_evaluation_table',
		Item: saveData,
	}
	return ddb.put(params).promise();
};

const containsSpecialChars = (str) => {
const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
return specialChars.test(str);
};

const removeSpecialChars = (str) => {
	return str.replace(/[^a-zA-Z0-9 ]/g, '');
};

const isValidEmail = (email) => {
return String(email)
	.toLowerCase()
	.match(
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};