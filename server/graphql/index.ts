import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema, getContext } from './schema';

export function setupGraphQL(app: Express) {
  app.use('/graphql', graphqlHTTP((req) => ({
    schema,
    context: getContext({ req }),
    graphiql: process.env.NODE_ENV === 'development', // GraphiQL interface for development
  })));
}