import { errorResponse } from "../middleware/serverResponse.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt, { compare } from "bcryptjs";
import crypto from "crypto";
import usermodel from "../models/usermodel.js";
import dotenv from "dotenv";

dotenv.config();
const secrectKey = crypto.randomBytes(48).toString("hex");

export function generateAccessToken(id, email, firstname) {
  const sessionid = createSession(id);
  const encoded_tokenPayload = {
    id,
    email,

    firstname,
  };
  const public_tokenPayload = {
    id,
    email,
    sessionid,
    firstname,
  };
  const encoded_token = jwt.sign(encoded_tokenPayload, secrectKey, {
    expiresIn: "1d",
  });
  const public_token = jwt.sign(public_tokenPayload, secrectKey, {
    expiresIn: "1d",
  });
  return { encoded_token, public_token };
}

export function validatetoken(token) {
  try {
    return jwt.verify(token, secrectKey);
  } catch (error) {
    throw error;
  }
}

// auth middleware
/**
 *
 * @param {import("express").Request} req
 * @param {Response} res
 * @param {import("express").Nextexport function} next
 */
export function authMiddleware(req, res, next) {
  const authHeader =
    req.headers.Authorization || req.headers.authorization || req.query.token;

  if (!authHeader) {
    errorResponse(res, 401, "token not found");
    return;
  }
  const encoded_token = authHeader.split(" ")[1];

  if (!encoded_token) return res.status(401).json("Unauthorize user");

  try {
    const decoded = jwt.verify(encoded_token, secrectKey);

    if (!decoded.id || !decoded.email) {
      console.log("Not authorized");
      return res.status(401).json("Unauthorize user");
    }

    res.locals["id"] = decoded.id;
    res.locals["email"] = decoded.email;

    next();
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, 401, "user not authorized");
  }
}

//hash pass
export function bcryptPassword(password) {
  return bcrypt.hashSync(password, 10);
}

//compare pass
export function comparePassword(password, hashedpassword) {
  return bcrypt.compareSync(password, hashedpassword);
}

//sessions...
let sessions = new Map();
/**
 *
 * @param {Object} data
 * @returns
 */
export function createSession(id) {
  const sessionId = uuidv4();
  sessions.set(id, sessionId);
  return sessionId;
}

export function getSessionData(id) {
  return sessions.has(id) ? sessions.get(id) : null;
}

export function deleteSession(id) {
  return sessions.has(id) ? sessions.delete(id) : false;
}

export async function Admin() {
  const adminstr = process.env.ADMIN;
  const admins = adminstr.split(",");

  for (const email of admins) {
    const exist = await usermodel.findOne({ email });
    if (!exist) {
      await usermodel.create({
        firstname: "admin",
        lastname: "admin",
        email: email,
        mobile: "+91 8600710244",
        password: bcryptPassword("1234"),
      });
    } else {
      console.log("admin already exist");
    }
  }
}
