import request, { gql } from "graphql-request";
import { useChainData } from "hooks/useChainData";
import { useQuery } from "@tanstack/react-query";

const query = gql`
  query topPlayersQuery {
    owners {
      id
      ownedTokens {
        gameId
      }
    }
  }
`;

export function useTopPlayers() {
  const {
    chainData: { subgraph },
  } = useChainData();

  return useQuery({
    queryKey: ["topPlayers", subgraph],
    queryFn: async () => {
      if (!subgraph) {
        throw new Error("No subgraph endpoint configured");
      }
      console.log("🔍 useTopPlayers: Querying subgraph:", subgraph);
      const result = await request(subgraph, query);
      console.log("🔍 useTopPlayers: Query result:", result);
      return result;
    },
    enabled: !!subgraph,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
}
