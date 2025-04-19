import {
  errorResponse,
  successResponse,
} from "../middleware/serverResponse.js";
import todosmodel from "../models/todosmodel.js";

export async function getalltodosHandler(req, res) {
  try {
    const { pageno = 0, filterBy = {}, sortby, search = "" } = req.body;

    const limit = 10;
    const skip = pageno * limit;

    let query = {};

    
    if (filterBy.priority) {
      query.priority = filterBy.priority;
    }

    
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { priority: { $regex: searchRegex } },
      ];
    }

    const sortBy =
      sortby && typeof sortby === "object" && Object.keys(sortby).length > 0
        ? sortby
        : { priority: 1 }; 

    const todos = await todosmodel
      .find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    successResponse(res, "success", todos);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "Internal Server Error");
  }
}

export async function createtodosHandler(req, res) {
  try {
    const { title, description, priority, duedate } = req.body;
    if (!title || !description || !priority || !duedate) {
      return errorResponse(res, 400, "some params are missing");
    }
    const params = { title, description, priority, duedate };
    const todos = await todosmodel.create(params);
    successResponse(res, "successfully added", todos);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

export async function updatetodosHandler(req, res) {
  try {
    const { _id, ...updatedData } = req.body;
    const options = { new: true };
    if (
      !updatedData.title ||
      !updatedData.description ||
      !updatedData.priority ||
      !updatedData.duedate
    ) {
      errorResponse(res, 404, "Some params are missing");
      return;
    }
    const updated = await todosmodel.findByIdAndUpdate(
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

export async function deletetodosHandler(req, res) {
  try {
    const { _id } = req.body;
    if (!_id) {
      return errorResponse(res, 400, "some params are missing");
    }
    const todos = await todosmodel.findByIdAndDelete({ _id: _id });
    if (!todos) {
      return errorResponse(res, 404, "todos id not found");
    }
    successResponse(res, "Success");
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
