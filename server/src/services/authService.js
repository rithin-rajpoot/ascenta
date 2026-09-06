import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * Register a new user
 */
export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("User already exists");
    error.status = 400;
    throw error;
  }

  const validRole = ["student", "faculty"].includes(role) ? role : "student";

  const user = await User.create({ name, email, password, role: validRole });
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  };
};

/**
 * Login — works for both students and faculty
 */
export const loginUser = async ({ email, password, role }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  if (role && user.role !== role) {
    const error = new Error(`No account found with this email as a ${role}`);
    error.status = 404;
    throw error;
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  };
};

/**
 * Get current user profile
 */
export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};