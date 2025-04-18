import postmodel from "../models/postmodel.js";
import {
  errorResponse,
  successResponse,
} from "../middleware/serverResponse.js";

export async function createpostHandler(req, res) {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return errorResponse(res, 400, "some params are missing");
    }
    const params = { title, content, author };
    const post = await postmodel.create(params);
    successResponse(res, "successfully added", post);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

export async function getallpostHandler(req, res) {
  try {
    const post = await postmodel.find();
    successResponse(res, "success", post);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
