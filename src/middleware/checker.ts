import { Handler } from "express";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";

export const loginChecker: Handler = (req, res, next) => {
  const token = req.header("x-access-token");

  if (!token) {
    return res.status(401).json({
      error: {
        message: "로그인을 먼저 해주세요.",
      },
    });
  }

  try {
    verify(token, process.env.JWT_SECRET!);
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      return res.status(401).json({
        error: {
          message: "토큰 정보가 잘못되었습니다. 다시 시도해주세요.",
        },
      });
    }
    if (e instanceof TokenExpiredError) {
      return res.status(403).json({
        error: {
          message: "토큰이 만료되었습니다. 다시 로그인해주세요.",
        },
      });
    }
  }

  return next();
};

export type UserJwtPayload = JwtPayload & {
  id: string;
};

export type AdminJwtPayload = UserJwtPayload & {
  isAdmin: boolean;
};

// loginChecker를 먼저 수행해야 함
export const adminChecker: Handler = (req, res, next) => {
  const token = req.header("x-access-token");

  try {
    const { isAdmin } = verify(token!, process.env.JWT_SECRET!) as AdminJwtPayload;
    if (!isAdmin) {
      return res.status(403).json({
        error: {
          message: "어드민이 아닙니다.",
        },
      });
    }
  } catch (e) {
    console.error(e);
  }

  return next();
};
