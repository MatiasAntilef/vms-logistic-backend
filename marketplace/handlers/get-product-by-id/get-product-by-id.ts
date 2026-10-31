import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { Product } from "../../../shared/types/product";
import { resOk, resServerError } from "../../../shared/utils/response";

const dynamoDbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return resServerError("Product ID is required");
    }

    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE_NAME_PRODUCTS,
        Key: { id: id },
      }),
    );

    const product = Item as Product | undefined;

    if (product === undefined || product?.isActive === false) {
      return resServerError("Product not found");
    }

    return resOk("Products retrieved successfully", product);
  } catch (error) {
    console.error("Error creating product:", error);
    return resServerError("Internal Server Error");
  }
};
