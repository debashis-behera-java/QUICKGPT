import axios from "axios";

const grok = axios.create({
  baseURL: "https://api.x.ai/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROK_API_KEY}`,
  },
});

export default grok;
