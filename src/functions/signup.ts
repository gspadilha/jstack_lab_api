import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SignUpController } from "../controllers/SignUpController";
import { parseEvent } from "../utils/parseEvents";
import { parseResponse } from "../utils/parseRespose";

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event);
  const response = await SignUpController.handle(request);
  return parseResponse(response);
}
