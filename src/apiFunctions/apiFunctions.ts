import { apiFetchFactory } from "./apiFetchFactory";

export const { getData, useGetData } = apiFetchFactory({
  name: "getData",
  url: "https://jsonplaceholder.typicode.com/todos/1",
  options: {
    method: "GET"
  }
});
