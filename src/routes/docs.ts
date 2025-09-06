import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Express } from 'express';
import path from 'path';

export function setupDocs(app: Express) {
  const openapiSpec = YAML.load(path.join(__dirname, '../../openapi.yaml'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
}
