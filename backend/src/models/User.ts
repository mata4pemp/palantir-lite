import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

//interface for user document, iuser - what a suer looks like,
// extends - include all the stuff mongoose gives a DB record like an ID , save/delete
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  //compare the pw typed to the pw in DB
  comparePassword(candidatePassword: string): Promise<boolean>;
}

//create the schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name required"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minlength: [6, "Password min 6 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//hash the password
//runs before user saved to the DB
userSchema.pre<IUser>("save", async function (next) {
  //if password was changed
  if (!this.isModified("password")) {
    return;
  }

  //hash the password with bcrypt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

//export model
export default mongoose.model<IUser>("User", userSchema);
