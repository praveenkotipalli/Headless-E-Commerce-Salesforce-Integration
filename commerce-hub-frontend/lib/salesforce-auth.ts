import jsforce from "jsforce";

export async function getSalesforceConnection() {
  const conn = new jsforce.Connection({
    loginUrl: "https://login.salesforce.com",
  });

  await conn.login(
    process.env.SALESFORCE_USERNAME!,
    process.env.SALESFORCE_PASSWORD!
  );

  return conn;
}