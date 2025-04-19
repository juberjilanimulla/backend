import {
  errorResponse,
  successResponse,
} from "../middleware/serverResponse.js";
import commentmodel from "../models/commentmodel.js";

export async function createcommentHandler(req, res) {
  try {
    const { postid, comment } = req.body;
    if (!postid || !comment) {
      return errorResponse(res, 400, "some params are missing");
    }
    const params = { postid, comment };
    const comments = await commentmodel.create(params);
    successResponse(res, "successfully added", comments);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

export async function deletecommentHandler(req, res) {
  try {
    const { _id } = req.body;
    if (!_id) {
      return errorResponse(res, 400, "some params are missing");
    }
    const comment = await commentmodel.findByIdAndDelete({ _id: _id });
    if (!comment) {
      return errorResponse(res, 404, "comment id not found");
    }
    successResponse(res, "Success");
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

export async function getcommentHandler(req, res) {
  try {
    const comment = await commentmodel.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "postid",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: "$post",
      },
      {
        $project: {
          title: "$post.title",
          content: "$post.content",
          author: "$post.author",
          createdAt: "$post.createdAt",
          comment: 1,
        },
      },
    ]);
    successResponse(res, "success", comment);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
