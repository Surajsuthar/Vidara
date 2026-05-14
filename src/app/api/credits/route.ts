import { getMyUser } from "@/lib/auth-service";
import { Errors, wrapError } from "@/lib/error";
import { getOrCreateUserCredit } from "@/utils/credit-service";

export async function GET() {
  try {
    const userAuth = await getMyUser();

    if (!userAuth) {
      const appError = Errors.unauthorized();
      return Response.json(appError.toResponse(), {
        status: appError.httpStatus,
      });
    }

    const credits = await getOrCreateUserCredit(userAuth.id);

    return Response.json({
      success: true,
      data: "Credits fetched successfully.",
      credits: credits.credit,
      expireAt: credits.expire,
    });
  } catch (error) {
    const appError = wrapError(error, "UNKNOWN");
    return Response.json(appError.toResponse(), {
      status: appError.httpStatus,
    });
  }
}
