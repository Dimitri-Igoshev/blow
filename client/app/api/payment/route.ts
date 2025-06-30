import type { ForwardResponse, IncomingPayload } from "../types";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data: IncomingPayload = await req.json();

    const username = "29228";
    const password =
      "c2e08d259f7c5754c425c58ad89c97e3552fcb2407840aef23aa44379d2edc8e";
    const authHeader =
      "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

    const res = await fetch("https://checkout.overpay.io/ctp/api/checkouts", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result: ForwardResponse = await res.json();

    console.log("[FORWARD RESPONSE]", result);

    const transaction = fetch("https://blow.igoshev.de/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("[TRANSACTION RESPONSE]", transaction);

    return Response.json(result);
  } catch (error) {
    console.error("[FORWARD ERROR]", error);

    return new Response(
      JSON.stringify({ message: "Ошибка при отправке данных" }),
      { status: 500 },
    );
  }
}
