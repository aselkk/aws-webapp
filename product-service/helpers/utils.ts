export const buildResponse = (status:number, body:any) => ({
  statusCode: status,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
  },
  body: JSON.stringify(body)
})
