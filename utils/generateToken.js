import jwt from "jsonwebtoken";

export const generateToken = async ({ userId, name, role }) => {
  return await jwt.sign({ userId, name, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};
