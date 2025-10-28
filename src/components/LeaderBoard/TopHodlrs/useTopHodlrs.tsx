import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";

const query = gql`
  query topHodlrsQuery {
    owners {
      id
      ownedTokens {
        gameId
      }
    }
  }
`;

export function useTopHodlrs() {
  const {
    chainData: { subgraph },
  } = useChainData();

  return useQuery({
    queryKey: ["topHodlrs", subgraph],
    queryFn: async () => {
      if (!subgraph) {
        throw new Error("No subgraph endpoint configured");
      }
      console.log("🔍 useTopHodlrs: Querying subgraph:", subgraph);
      const result = await request(subgraph, query);
      console.log("🔍 useTopHodlrs: Query result:", result);
      return result;
    },
    enabled: !!subgraph,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
}
