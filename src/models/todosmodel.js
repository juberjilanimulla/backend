import { model, Schema } from "mongoose";

const todosSchema = new Schema(
  {
    title: String,
    description: String,
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "" },
    duedate: Date,
  },
  { timestamps: true, versionKey: false }
);

function currentLocalTimePlusOffset() {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + offset);
}

todosSchema.pre("save", function (next) {
  const currentTime = currentLocalTimePlusOffset();
  this.updatedAt = currentTime;
  this.createdAt = currentTime;
  next();
});

todosSchema.pre("findOneAndUpdate", function (next) {
  const currentTime = currentLocalTimePlusOffset();
  this.set({ updatedAt: currentTime });
  next();
});

const todosmodel = model("todos", todosSchema);
export default todosmodel;
