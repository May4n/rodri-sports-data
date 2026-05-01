import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  // O Netlify já passa o IP real do visitante nesse header
  const clientIp = event.headers["y-forwared-for"] ?? "unknown";
  console.log(`Requisição de: ${clientIp}`);

  const { endpoint, ...rest } = event.queryStringParameters ?? {};

  const query = new URLSearchParams(rest as Record<string, string>).toString();
  const url = `https://v1.basketball.api-sports.io${endpoint}${query ? "?" + query : ""}`;

  const res = await fetch(url, {
    headers: {
      "x-apisports-key": process.env.VITE_API_FOOTBALL_KEY ?? "",
      Host: "v1.basketball.api-sports.io",
    },
  });

  const data = await res.json();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};

export { handler };
