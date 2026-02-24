import { createAssistantTokenHandler } from "modifywithai/nextjs";
import { headers, cookies } from "next/headers";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";

// Use dynamic access to prevent Next.js/Turbopack from inlining env vars at build time
const getEnv = (key: string) => process.env[key];

export async function POST(request: Request) {
  const handler = createAssistantTokenHandler({
    appId: getEnv("MWAI_APP_ID")!,
    apiKey: getEnv("MWAI_API_KEY")!,
    getEndUserId: async () => {
      const session = await getServerSession({
        req: buildLegacyRequest(await headers(), await cookies()),
      });
      return session?.user?.id?.toString() ?? null;
    },
  });
  return handler(request);
}
