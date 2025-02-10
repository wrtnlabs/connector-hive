import { Injectable } from "@nestjs/common";
import { ConnectorHiveConfiguration } from "@wrtnlabs/connector-hive/ConnectorHiveConfiguration";
import { Cohere, CohereClientV2 } from "cohere-ai";

/**
 * Cohere API related constants.
 */
export namespace CohereConstants {
  /**
   * https://docs.cohere.com/reference/tokenize
   */
  export const COHERE_TOKENIZER_MIN_LENGTH = 1;
  /**
   * https://docs.cohere.com/reference/tokenize
   */
  export const COHERE_TOKENIZER_MAX_LENGTH = 65536;
  /**
   * https://docs.cohere.com/docs/models
   */
  export const COHERE_EMBEDDING_MODEL = "embed-multilingual-light-v3.0";
}

export enum SemanticInputType {
  Document,
  Query,
}

function semanticInputTypeToCohereInputType(
  inputType: SemanticInputType,
): Cohere.EmbedInputType {
  switch (inputType) {
    case SemanticInputType.Document:
      return "search_document";
    case SemanticInputType.Query:
      return "search_query";
  }
}

@Injectable()
export class SemanticCohereService {
  private readonly cohere = new CohereClientV2({
    token: ConnectorHiveConfiguration.COHERE_API_KEY(),
  });

  async tokenize(text: string): Promise<string[]> {
    if (text.length === 0) {
      return [];
    }

    if (text.length < CohereConstants.COHERE_TOKENIZER_MIN_LENGTH) {
      return [text];
    }

    const tokens: string[] = [];

    for (
      let offset = 0;
      offset < text.length;
      offset += CohereConstants.COHERE_TOKENIZER_MAX_LENGTH
    ) {
      let chunk = text.slice(offset);

      if (CohereConstants.COHERE_TOKENIZER_MAX_LENGTH < chunk.length) {
        chunk = chunk.slice(0, CohereConstants.COHERE_TOKENIZER_MAX_LENGTH);
      }

      const res = await this.cohere.tokenize({
        text: chunk,
        model: CohereConstants.COHERE_EMBEDDING_MODEL,
      });

      tokens.push(...res.tokenStrings);
    }

    return tokens;
  }

  async embed(text: string, inputType: SemanticInputType): Promise<number[]> {
    const cohereInputType = semanticInputTypeToCohereInputType(inputType);
    const res = await this.cohere.embed({
      texts: [text],
      model: CohereConstants.COHERE_EMBEDDING_MODEL,
      inputType: cohereInputType,
      embeddingTypes: ["float"],
    });

    if (!res.embeddings.float || res.embeddings.float.length === 0) {
      throw new Error("no float embeddings returned");
    }

    return res.embeddings.float[0];
  }
}
