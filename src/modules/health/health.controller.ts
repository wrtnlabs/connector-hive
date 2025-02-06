import { TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { Health } from "@wrtnlabs/connector-hive-api/lib/structures/health";

@Controller("health")
export class HealthController {
  @TypedRoute.Get()
  get(): Health.GetRes {
    return {
      health: "good",
    };
  }
}
