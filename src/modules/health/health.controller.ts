import { TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IHealth } from "@wrtnlabs/connector-hive-api/lib/structures/health/IHealth";

@Controller()
export class HealthController {
  /**
   * Get the health status of the server.
   *
   * @returns The health status of the server.
   *
   * @tags health
   */
  @TypedRoute.Get("health")
  get(): IHealth {
    return {
      health: "good",
    };
  }
}
