import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({
      success: false,
      error: "No authorization code found",
    });
  }

  try {
    const response = await fetch(
      "https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.SALESFORCE_CLIENT_ID!,
          client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
          redirect_uri: "http://localhost:3000",
          code,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}