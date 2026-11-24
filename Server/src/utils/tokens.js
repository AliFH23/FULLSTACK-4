import jwt from "jsonwebtoken";
import crypto from "crypto";

// Access token: قصير العمر، وفيه id و role
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
};

// Refresh token: طويل العمر
// jwtid: رقم فريد، عشان ما يطلع توكنين متطابقين لو انعملوا بنفس الثانية
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
      jwtid: crypto.randomUUID(),
    }
  );
};

// بنخزن الـ hash بالداتابيس، مش التوكن نفسه
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};