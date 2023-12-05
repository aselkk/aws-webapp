import { handler } from './importProductsFile';
import { S3 } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const mockedS3 = {
    getSignedUrlPromise: jest.fn(),
  };
  return { S3: jest.fn(() => mockedS3) };
});

describe('importProductsFile Lambda', () => {
  it('should return signed URL', async () => {
    const mockGetSignedUrlPromise = S3.prototype.getSignedUrlPromise as jest.Mock;
    const expectedSignedUrl = 'https://example.com/signed-url';

    mockGetSignedUrlPromise.mockResolvedValue(expectedSignedUrl);

    const event = {
      queryStringParameters: { name: 'example.csv' },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify({ signedUrl: expectedSignedUrl }));

    expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', {
      Bucket: 'import-service-rs-bucket',
      Key: 'uploaded/example.csv',
      Expires: 60,
      ContentType: 'text/csv',
      ACL: 'private',
    });
  });

  it('should return 400 for missing name parameter', async () => {
    const event = {
      queryStringParameters: {},
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({ error: 'Missing name parameter in the query string' }));
  });
});
