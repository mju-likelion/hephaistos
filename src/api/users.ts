import { Router } from "express";
import { verify } from "jsonwebtoken";

import { AdminJwtPayload, loginChecker } from "../middleware/checker";
import Admin from "../models/admin";
import User from "../models/user";

const users = Router();

// 유저 정보
users.get("/:id", loginChecker, async (req, res) => {
  const token = req.header("x-access-token");
  const { id, isAdmin } = verify(token!, process.env.JWT_SECRET!) as AdminJwtPayload;
  if (req.params.id === "me") {
    let me;
    if (isAdmin) {
      // @ts-ignore
      me = await Admin.findOne({
        where: { id },
        attributes: ["name"],
      });
    } else {
      // @ts-ignore
      me = await User.findOne({ where: { id }, attributes: ["name"] });
    }
    return res.json({
      data: {
        user: {
          // @ts-ignore
          name: me.name,
          isAdmin,
        },
      },
    });
  }

  if (!isAdmin && id !== req.params.id) {
    return res.status(403).json({
      error: {
        message: "권한이 없습니다.",
      },
    });
  }

  // @ts-ignore
  const me = await User.findOne({
    where: { id },
    attributes: ["name"],
  });
  return res.json({
    data: {
      user: {
        // @ts-ignore
        name: me.name,
        isAdmin: false,
      },
    },
  });
});

export default users;
