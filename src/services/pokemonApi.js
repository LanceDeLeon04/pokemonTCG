import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.pokemontcg.io/v2/" }),
  endpoints: (builder) => ({
    getCards: builder.query({
      query: ({ name = "", page = 1, pageSize = 20 }) =>
        `cards?page=${page}&pageSize=${pageSize}${name ? `&q=name:${name}` : ""}`,
    }),
  }),
});

export const { useGetCardsQuery } = pokemonApi;