import {
  errorResponse,
  successResponse,
} from "../middleware/serverResponse.js";
import usermodel from "../models/usermodel.js";
import {
  bcryptPassword,
  comparePassword,
  generateAccessToken,
} from "../utils/helperFunction.js";

export async function signupHandler(req, res) {
  try {
    const { firstname, lastname, email, password, mobile } = req.body;
    if (!firstname || !lastname || !email || !password || !mobile) {
      return errorResponse(res, 400, "some params are missing");
    }
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, "User with this email already exists");
    }
    const existingMobile = await usermodel.findOne({ mobile });
    if (existingMobile) {
      return errorResponse(res, 409, "User with this mobile already exists");
    }
    const hashedpassword = bcryptPassword(password);

    const params = {
      firstname,
      lastname,
      email,
      password: hashedpassword,
      mobile,
    };
    const signup = await usermodel.create(params);
    successResponse(res, "success", signup);
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}

export async function loginHandler(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const users = await usermodel.findOne({ email });

    if (!users) {
      return errorResponse(res, 404, "Email does not exist");
    }
    const comparepassword = comparePassword(password, users.password);

    if (!comparepassword) {
      return errorResponse(res, 404, "Invalid Password");
    }

    const userid = users._id.toString();

    const { encoded_token, public_token } = generateAccessToken(
      userid,
      users.email,
      users.firstname
    );

    successResponse(res, "SignIn successfully", {
      encoded_token,
      public_token,
    });
  } catch (error) {
    console.log("error", error);
    errorResponse(res, 500, "internal server error");
  }
}
