import z from "zod";
import { Errors, wrapError } from "@/lib/error";
import { getClientInfo, rateLimit } from "@/lib/utils";

const generateRequestSchema = z.object({
  prompt: z.string(),
});

export async function POST(req: Request) {
  try {
    const clientIp = getClientInfo(req);
    const { success, remaining, reset, pending } =
      await rateLimit.limit(clientIp);
    void pending;

    if (!success) {
      const retryAfterSeconds = Math.max(
        0,
        Math.ceil((reset - Date.now()) / 1000),
      );
      const appError = Errors.rateLimited();

      return Response.json(appError.toResponse(), {
        status: appError.httpStatus,
        headers: { "Retry-After": retryAfterSeconds.toString() },
      });
    }

    return Response.json({ success: true, remaining });
  } catch (error) {
    const appError = wrapError(error);
    return Response.json(appError.toResponse(), {
      status: appError.httpStatus,
    });
  }
}
