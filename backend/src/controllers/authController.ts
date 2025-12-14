import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

//interface for singup request body
interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
}

//interface for sign in request body
interface SigninRequestBody {
  email: string;
  password: string;
}

//interface for JWT payload
interface JWTPayload {
  userId: string;
  role: string;
}

//function to generate JWT token
const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role } as JWTPayload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

//signup controller
export const signup = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "please provide name email and password to continue",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    //check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    //create a new user
    const user: IUser = await User.create({
      name,
      email,
      password,
    });

    //generate jwt token
    const token = generateToken(user._id.toString(), user.role);

    //success signup
    return res.status(201).json({
      message: "user created successfully",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup error", error);
    return res.status(500).json({
      error: "Server error during signup",
    });
  }
};

//sign in controller
export const signin = async(
    req: Request<{}, {}, SigninRequestBody>,
    res: Response
): Promise<Response> => {
    try {
        const {email,password} = req.body;

        //validation
        if (!email || !password){
            return res.status(400).json({
                error: 'Please provide email and password'
            });
        }

        //Find user by email
        const user: IUser | null = await User.findOne({email});
        if(!user) {
            //dont want hackers to know exzactly which security problem: email not found or wrong password
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        //check the PW
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid){
            return res.status(401).json({
                error: 'Invalid email or password'
            })
        }

        //generate JWT token
        const token = generateToken(user._id.toString(), user.role);

        return res.json({
            message: 'Signed in successfully',
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        })
    } catch (error){
        console.error('Signin error', error);
        return res.status(500).json({
            error: 'Server error during signin'
        });
    }
}

//When a user is logged in, your frontend might want to fetch the user’s info (name, email, account creation date).
//Frontend retrieve the user profile as they are logged in
export const getCurrentUser = async(
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({error: 'Unauthorized'});
        }

        //find the user, excluding the password
        const user = await User.findById(userId).select('-password');

        if (!user){
            return res.status(404).json({error: 'User not found'});
        }

        return res.json({
            user: {
                id:user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get current user error', error);
        return res.status(500).json({
            error: 'Server error'
        })
    }
}

//Signout controller
//signout is done by removing token, this is jst a placeholder to confirm signout
export const signout = async(
    req: Request,
    res:Response
): Promise<Response> => {
    return res.json({
        message: 'Signed out successfully. Remove token from client'
    })
}