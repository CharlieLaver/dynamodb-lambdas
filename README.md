# artscapy-evaluation

 ## Architecture
My plan is to use a Vue frontend that will send HTTP requests to an AWS API gateway. This gateway will be configured with POST & GET routes that will direct the request to the relevant lambda function. The lambda functions will be connected to a DynamoDB.

![1_MFvtJPjmug6qbWa92mp5UA](https://user-images.githubusercontent.com/73779192/185815949-93d728a7-fb94-4ee6-8407-0db8f64d677f.png)

I have chosen to create a separate lambda function for fetching the table data.

## Logging
The environment variables & request is going to be logged to AWS CloudWatch every time a request is made to a lambda. To give access to this I will create a IAM user with a permission to access CloudWatch logs.

## Hosting
* I can deploy the Vue frontend to an AWS bucket (it must be public).
* I can host the git repository on GitHub.

## Logic
* To prevent the risk of a XSS attack, I will remove any special characters from the users input (where they are not needed) before inserting into the database.
* Always save the request data, after it has been validated.
* I can save any errors to an column in the db, where they can be fetched and displayed on the table.
