import usermodel from "../models/usermodel.js";
import {
  errorResponse,
  successResponse,
} from "../middleware/serverResponse.js";

export async function profileHandler(req, res) {
  try {
    const userid = res.locals && res.locals.id;

    const user = await usermodel.findById(userid);

    if (!user) {
      return errorResponse(res, 404, "invalid user");
    }

    successResponse(res, "success profile", user);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
