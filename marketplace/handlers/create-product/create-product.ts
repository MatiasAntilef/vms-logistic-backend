import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Product } from "../../../shared/types/product";
import { randomUUID } from "crypto";
import { resCreated, resServerError } from "../../../shared/utils/response";

const dynamoDbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}") as Product;
    const now = new Date().toISOString();

    const newProduct: Product = {
      ...body,
      id: randomUUID(),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME_PRODUCTS,
        Item: newProduct,
      }),
    );

    return resCreated("Product created successfully", newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return resServerError("Internal Server Error");
  }
};
