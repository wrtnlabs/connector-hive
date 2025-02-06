import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { ConnectorHiveConfiguration } from "./ConnectorHiveConfiguration";
import { ConnectorHiveModule } from "./ConnectorHiveModule";

export class ConnectorHiveBackend {
  private application_?: INestApplication;

  public async open(): Promise<void> {
    //----
    // OPEN THE BACKEND SERVER
    //----
    // MOUNT CONTROLLERS
    this.application_ = await NestFactory.create(ConnectorHiveModule, {
      logger: false,
    });

    // DO OPEN
    this.application_.enableCors();
    await this.application_.listen(
      ConnectorHiveConfiguration.API_PORT(),
      "0.0.0.0",
    );

    //----
    // POST-PROCESSES
    //----
    // INFORM TO THE PM2
    if (process.send) process.send("ready");

    // WHEN KILL COMMAND COMES
    process.on("SIGINT", async () => {
      await this.close();
      process.exit(0);
    });
  }

  public async close(): Promise<void> {
    if (this.application_ === undefined) return;

    // DO CLOSE
    await this.application_.close();
    delete this.application_;
  }
}
