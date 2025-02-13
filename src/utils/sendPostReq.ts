import { baseURL } from "../utils/env";

const sendPostReq = async ({ path, opts }: { path: string; opts: {} }) => {
  const response = await fetch(`${baseURL}${path}`, opts);  

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const json = await response.json();

  return json;
};

export default sendPostReq;
