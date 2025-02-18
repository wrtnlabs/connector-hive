import { SwaggerCustomizer } from "@nestia/core";

export const AttachSwaggerSecurityBearer = SwaggerCustomizer((props) => {
  props.route.security ??= [];
  props.route.security.push({
    bearer: [],
  });
});
