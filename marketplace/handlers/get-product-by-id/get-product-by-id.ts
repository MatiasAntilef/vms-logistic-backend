import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

import { GetProductType } from "../../../shared/types/product";
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

    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME_PRODUCTS,
        FilterExpression: "isActive = :isActive AND id = :id",
        ExpressionAttributeValues: {
          ":isActive": true,
          ":id": id,
        },
      }),
    );

    const products = result.Items as GetProductType[];

    if (products.length === 0) {
      return resServerError("Product not found");
    }

    return resOk("Products retrieved successfully", products);
  } catch (error) {
    console.error("Error creating product:", error);
    return resServerError("Internal Server Error");
  }
};
