import { useState } from 'react';
import { graphqlRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Simple component to test the GraphQL API
export const GraphQLTest = () => {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simple query to test the GraphQL API
  const testQuery = `
    query {
      trending {
        page
        total_results
        results {
          ... on Movie {
            id
            title
            poster_path
            vote_average
          }
          ... on TvShow {
            id
            name
            poster_path
            vote_average
          }
        }
      }
    }
  `;

  const handleTestGraphQL = async () => {
    setIsLoading(true);
    try {
      const data = await graphqlRequest(testQuery);
      setResult(data);
      toast({
        title: 'GraphQL Test Successful',
        description: 'Successfully fetched data from GraphQL API',
      });
    } catch (error) {
      console.error('GraphQL test error:', error);
      toast({
        title: 'GraphQL Test Failed',
        description: (error as Error).message || 'An error occurred during the GraphQL test',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8 bg-gray-900 text-white border border-gray-800">
      <CardHeader>
        <CardTitle>GraphQL API Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleTestGraphQL} 
          disabled={isLoading}
          className="w-full bg-netflix-red hover:bg-red-700"
        >
          {isLoading ? 'Testing...' : 'Test GraphQL API'}
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-800 rounded-md overflow-auto max-h-96">
            <pre className="text-xs text-white">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};