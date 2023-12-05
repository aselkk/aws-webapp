import { S3 } from 'aws-sdk';

export const handler = async (event:any) => {
  try {
    const { name } = event.queryStringParameters;

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing name parameter in the query string' }),
      };
    }

    const s3 = new S3();
    const fileName = `uploaded/${name}`;
    const s3Params = {
      Bucket: 'import-service-rs-bucket',
      Key: fileName,
      Expires: 60, 
      ContentType: 'text/csv', 
      ACL: 'private',
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', s3Params);

    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
