import { useQuery } from "@tanstack/react-query"

function useCommunity() {
   const { data: community } = useQuery({
      queryKey: ['community'],
      queryFn: 
   })

   return { community }
}
