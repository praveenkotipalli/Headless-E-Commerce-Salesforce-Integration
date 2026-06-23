import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAccessToken } from "@/lib/salesforce";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      password,
      phone,
    } = body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const accessToken =
      getAccessToken();

    const response = await fetch(
      "https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/sobjects/Customer__c",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          Email__c: email,
          Password__c: hashedPassword,
          Phone__c: phone,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}