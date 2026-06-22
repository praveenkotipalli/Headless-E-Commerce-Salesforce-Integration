export async function getProductById(id: string) {
  const accessToken =
    await getAccessToken();

  const response = await fetch(
    `https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/sobjects/Product__c/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  return response.json();
}


export async function getAccessToken() {
  const response = await fetch(
    "https://login.salesforce.com/services/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id:
          process.env.SALESFORCE_CLIENT_ID!,
        client_secret:
          process.env.SALESFORCE_CLIENT_SECRET!,
        refresh_token:
          process.env.SALESFORCE_REFRESH_TOKEN!,
      }),
    }
  );

  const data = await response.json();

  if (!data.access_token) {
    throw new Error(
      `Failed to get Salesforce token: ${JSON.stringify(
        data
      )}`
    );
  }

  return data.access_token;
}