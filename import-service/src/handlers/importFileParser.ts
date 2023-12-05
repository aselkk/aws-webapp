import csvParser from 'csv-parser';
import { S3 } from 'aws-sdk';

export const handler = async (event:any) => {
  try {
    const s3 = new S3();
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    if (!key.startsWith('uploaded/')) {
      console.log('Skipping non-uploaded folder event:', key);
      return;
    }

    console.log(`Processing file: s3://${bucket}/${key}`);

    const s3Stream = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();

    s3Stream
      .pipe(csvParser())
      .on('data', (record:any) => {
        console.log('Parsed record:', record);
      })
      .on('end', () => {
        console.log('CSV parsing finished.');
      });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'CSV parsing initiated' }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
