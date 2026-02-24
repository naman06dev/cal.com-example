import { createAssistantTokenHandler } from "modifywithai/nextjs";
import { headers, cookies } from "next/headers";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";

export async function POST(request: Request) {
  const handler = createAssistantTokenHandler({
    appId: process.env.MWAI_APP_ID!,
    apiKey: process.env.MWAI_API_KEY!,
    getEndUserId: async () => {
      const session = await getServerSession({
        req: buildLegacyRequest(await headers(), await cookies()),
      });
      return session?.user?.id?.toString() ?? null;
    },
  });
  return handler(request);
}
