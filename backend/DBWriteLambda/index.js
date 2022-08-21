const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

exports.handler = async (event, context, callback) => {
    
    if(event != null && event != undefined) {
        
        const postData = JSON.parse(event.body);
        const requestId = context.awsRequestId;
        let saveData = {id: requestId};
        let errors = [];
        
        // Validate all fields & remove any special chars (when not required) - to prevent XSS
        // If the data does not pass validation still save to db but just remove any security risks
        
        // Validate name
        if(postData.hasOwnProperty('name')) {
            if(containsSpecialChars(postData.name)) {
                errors.push('Name contained special characters!');
            }
           saveData.name = removeSpecialChars(postData.name);
        } else {
            errors.push('There was no name field set!');
            saveData.name = '';
        }
        
        // Validate email
        if(postData.hasOwnProperty('email')) {
            if(!isValidEmail(postData.email)) {
                errors.push('Email format is not valid!');
            }
            // Remove any unvalid email chars (to prevent XSS)
            saveData.email = postData.email.replace(/[^a-zA-Z @.0-9]/g,'');
        } else {
            errors.push('There was no email field set!');
            saveData.email = '';
        }
        
        // Validate age
        if(postData.hasOwnProperty('age')) {
            if(Number.isInteger(parseInt(postData.age))) {
                saveData.age = postData.age;
            } else {
                saveData.age = removeSpecialChars(postData.age.toString());
                errors.push('Age is not of type int!');
            }
        } else {
            errors.push('There was no age field set');
            saveData.age = 0;
        }
        
        // Validate dob
        if(postData.hasOwnProperty('dob')) {
            if(Date.parse(postData.dob)) {
                saveData.dob = postData.dob;
            } else {
                errors.push('DOB was not a valid date!');
                saveData.dob = removeSpecialChars(postData.dob.toString());
            }
        } else {
            errors.push('There was no dob field set!');
            saveData.dob = 0;
        }
        
        // Validate favouriteArtist
        if(postData.hasOwnProperty('favouriteArtist')) {
            if(containsSpecialChars(postData.favouriteArtist)) {
                errors.push('favouriteArtist contained special characters!');
            }
           saveData.favouriteArtist = removeSpecialChars(postData.favouriteArtist);
        } else {
            errors.push('There is no favouriteArtist field set!');
            saveData.favouriteArtist = '';
        }
        
        if(postData.hasOwnProperty('newsletterSignup')) {
            saveData.newsletterSignup = postData.newsletterSignup ? true : false;
        } else {
            errors.push('There is no newsletterSignup field set!');
            saveData.newsletterSignup = false;
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