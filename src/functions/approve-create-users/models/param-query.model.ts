export type ParamsQuery = {
  TableName: string;
  IndexName?: string;
  KeyConditionExpression?: string;
  ExpressionAttributeValues?: object;
  ExpressionAttributeNames?: object;
};
