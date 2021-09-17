import fetch from "node-fetch";
import { ACCESS_TOKEN, FB_API_HOST } from "../config.js";

export const fetchGroupFeeds = async (groupId) => {
  const fetchOnce = async (_url) => {
    try {
      const response = await fetch(_url);
      const json = await response.json();
      return json;
    } catch (e) {
      return {};
    }
  };

  const url = `${FB_API_HOST}/${groupId}/feed?fields=attachments&access_token=${ACCESS_TOKEN}`;
  const firstFetch = await fetchOnce(url);
  
};

fetchGroupFeeds(697332711026460);
