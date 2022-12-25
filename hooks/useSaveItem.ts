import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../data/supabaseClient";
import { Language } from "../@types/language";

const saveItem = async (table: string, data: Language) => {
  return await supabase.from(table).upsert(data);
};

const useSaveItem = (
  queryKey: {
    collection: string;
    select: string;
  },
  options: MutationOptions
) => {
  const queryClient = useQueryClient();
  const qk = [queryKey.collection, { select: queryKey.select }];

  return useMutation((data) => saveItem(queryKey.collection, data), {
    // When mutate is called:
    onMutate: async (newItem: Language) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(qk);

      // Snapshot the previous value
      const previousItems: Language[] = queryClient.getQueryData(qk);

      // Optimistically update to the new value
      if (previousItems) {
        queryClient.setQueryData<Language[]>(qk, (old: Language[]) => [
          ...old,
          newItem,
        ]);
      }

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (
      err,
      newTodo,
      context: {
        previousItems: Language[];
      }
    ) => {
      if (context?.previousItems) {
        queryClient.setQueryData<Language[]>(qk, context.previousItems);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(qk);
    },
    ...options,
  });
};

export default useSaveItem;
