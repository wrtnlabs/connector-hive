import { Module } from "@nestjs/common";

import { SemanticCohereService } from "./services/semantic.cohere.service";

@Module({
  providers: [SemanticCohereService],
  exports: [SemanticCohereService],
})
export class SemanticModule {}
