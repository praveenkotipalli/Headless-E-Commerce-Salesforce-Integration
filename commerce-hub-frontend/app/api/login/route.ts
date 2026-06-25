import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAccessToken } from "@/lib/salesforce";

export async function POST(request: Request) {
  try {
    const { email, password } =
      await request.json();

    const accessToken =
      await getAccessToken();

   const query = `
SELECT
Id,
Name,
Email__c,
Password__c,
Role__c
FROM Customer__c
WHERE Email__c='${email}'
`;

const sfResponse = await fetch(
  `https://orgfarm-c51590213e-dev-ed.develop.my.salesforce.com/services/data/v67.0/query?q=${encodeURIComponent(query)}`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);

    const data = await sfResponse.json();

    if (!data.records?.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = data.records[0];

    const validPassword =
      await bcrypt.compare(
        password,
        user.Password__c
      );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid Password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user.Id,
        email: user.Email__c,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
  id: user.Id,
  name: user.Name,
  email: user.Email__c,
  role: user.Role__c,
}
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}