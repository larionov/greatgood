const secret =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2FjNGQ4MWE3YWFlOTM4OWYwYmU1MiIsInJvbGVzIjpbeyJfaWQiOiI2NjdhYzRlODk3OWM5MGRhZmYzODZkMmMiLCJuYW1lIjoiQmFzaWMgQ2FuZGlkYXRlIiwicGVybWlzc2lvbnMiOlsidmlld19hcGlrZXlzIiwidmlld19kYXNoYm9hcmQiLCJ2aWV3X2NvcnBvcmF0ZSIsInZpZXdfaW5kaXZpZHVhbCJdLCJpbnRlcm5hbCI6ZmFsc2UsImxvY2tlZCI6ZmFsc2UsInNjb3BlIjoiNjY3YWM0YTE5NzljOTBkYWZmMzg2M2NhIiwiY3JlYXRlZEF0IjoiMjAyNC0wNi0yNVQxMzoyMzo1Mi41NjFaIiwidXBkYXRlZEF0IjoiMjAyNC0wNi0yNVQxMzoyNjo1My40NjdaIiwiX192IjowfV0sInNjb3BlcyI6WyI2NjdhYzRhMTk3OWM5MGRhZmYzODYzY2EiXSwia2V5SWQiOiI2NjdhYzViMjlmNDA3OTc1MmNkY2I3YmIiLCJpYXQiOjE3MTkzMjIwMzQsImV4cCI6MTc1MDg1ODAzNCwiYXVkIjoiYXBpa2V5IiwiaXNzIjoia3ljYy1zYW5kYm94LW11bHRpc2NvcGVfNjY3YWM0YTE5NzljOTBkYWZmMzg2M2NhIiwic3ViIjoiNjY3YWM0ZDgxYTdhYWU5Mzg5ZjBiZTUyIn0.EuhXvmjVeAWNouhBU0UqpfOGRAwWjaZKaOMmL2H9zMo";

type KV = { [key: string]: string };

export async function GET() {
  const data = await fetch(
    "http://interviewscope.sandbox.kyc-chain.com/integrations/v3/scope/667ac4a1979c90daff3863ca/applications",
    {
      headers: {
        apiKey: secret,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  if (!data.ok) {
    return new Response(null, {
      status: data.status,
      statusText: data.statusText,
    });
  }
  const json = await data.json();

  const applications = json.items.map((item: any) => {
    const properties: KV = Object.values(item.attributes).reduce((acc: KV, attribute: any) => {
      acc[attribute.label] = attribute.value;
      return acc;
    }, {});

    return {
      id: item.id,
      name: [properties["First name"], properties["Middle name"], properties["Last name"]].filter(Boolean).join(" "),
      email: properties["Email"],
      status: item.statusName,
      riskScoring: item["riskScoring"]?.currentCategory?.toUpperCase() ?? "Not calculated",
      createdAt: item.createdAt,
      updated: item.updated,
      type: item.type,
    };
  });

  return new Response(JSON.stringify(applications), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
