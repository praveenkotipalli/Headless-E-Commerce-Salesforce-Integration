import { getSalesforceConnection } from "@/lib/salesforce-auth";

export async function GET() {
  try {
    const conn = await getSalesforceConnection();

    return Response.json({
      success: true,
      user: conn.userInfo?.id,
      org: conn.userInfo?.organizationId,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}