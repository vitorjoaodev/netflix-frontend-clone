import { Express } from 'express';
import { createYoga } from 'graphql-yoga';
import { schema as generatedSchema } from './schema';

export function setupGraphQL(app: Express) {
  // Create a Yoga instance with the schema
  const yoga = createYoga({
    schema: generatedSchema,
    // Provide GraphiQL in development
    graphiql: process.env.NODE_ENV === 'development',
  });

  // Apply the yoga middleware to the express app
  app.use('/graphql', yoga);
}