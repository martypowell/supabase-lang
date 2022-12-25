import { Language } from "./../@types/language.d";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { supabase } from "../data/supabaseClient";

type useGetItemProps = {
  collection: string;
  select: string;
};

export const getItems = async ({ queryKey }): Promise<Language[]> => {
  const [collection, { select }] = queryKey;
  let { data, error, status, ...rest } = await supabase
    .from(collection)
    .select(select);

  if (error && status !== 406) {
    throw error;
  }

  return data;
};

const useGetItems = (
  { collection, select }: useGetItemProps,
  options: UseQueryOptions = {}
) => useQuery([collection, { select }], getItems, options);

export default useGetItems;
