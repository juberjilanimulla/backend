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

export async function updatepostHandler(req, res) {
  try {
    const { _id, ...updatedData } = req.body;
    const options = { new: true };
    if (!updatedData.title || !updatedData.content || !updatedData.author) {
      errorResponse(res, 404, "Some params are missing");
      return;
    }
    const updated = await postmodel.findByIdAndUpdate(
      _id,
      updatedData,
      options
    );

    successResponse(res, "success Updated", updated);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

export async function deletepostHandler(req, res) {
  try {
    const { _id } = req.body;
    if (!_id) {
      return errorResponse(res, 400, "some params are missing");
    }
    const jobposting = await postmodel.findByIdAndDelete({ _id: _id });
    if (!jobposting) {
      return errorResponse(res, 404, "jobposting id not found");
    }
    successResponse(res, "Success");
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
