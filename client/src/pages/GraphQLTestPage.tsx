import { GraphQLTest } from "@/components/GraphQLTest";
import Header from "@/components/Header";

const GraphQLTestPage = () => {
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Header />
      
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">GraphQL API Test</h1>
        
        <GraphQLTest />
      </div>
    </div>
  );
};

export default GraphQLTestPage;