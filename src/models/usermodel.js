import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    mobile: String,
    password: String,
  },
  { timestamps: true, versionKey: false }
);

function currentLocalTimePlusOffset() {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + offset);
}

userSchema.pre("save", function (next) {
  const currentTime = currentLocalTimePlusOffset();
  this.updatedAt = currentTime;
  this.createdAt = currentTime;
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  const currentTime = currentLocalTimePlusOffset();
  this.set({ updatedAt: currentTime });
  next();
});

const usermodel = model("user", userSchema);
export default usermodel;
