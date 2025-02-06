import { TypedBody, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ConnectorRetrieveRequest } from "@wrtnlabs/connector-hive-api/lib/structures/retrieve";

@Controller()
export class RetrieveController {
  @TypedRoute.Post("connector-retrieve-requests")
  async create(
    @TypedBody() body: ConnectorRetrieveRequest.CreateBody,
  ): Promise<void> {}
}
