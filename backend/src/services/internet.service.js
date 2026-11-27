// import {tavily as Tavily} from '@tavily/core';
// const tavily = Tavily({ apiKey: process.env.TAVILY_API_KEY});

// export const  searchInternet = async ({query}) =>{
//     console.log("SEARCHING:", query);
//     const results = await tavily.search(query,{
//         maxResults: 5,
//     });

//   console.log("SUCCESS");
// //  tools can return only numbers, strings. So we need to stringify the results before returning them.
//    console.log(JSON.stringify(results));
//    return JSON.stringify(results);
//       }







import { tavily } from "@tavily/core";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY_1,
});

export const searchInternet = async ({ query }) => {
  try {
    console.log("SEARCHING:", query);

    if (!process.env.TAVILY_API_KEY) {
      throw new Error("TAVILY_API_KEY is missing");
    }

    const results = await tavilyClient.search(query, {
      maxResults: 5,
    });

    console.log("SEARCH SUCCESS");

    return JSON.stringify(results);

  } catch (error) {
    console.error("TAVILY SEARCH ERROR:", error);
    throw error;
  }
};
