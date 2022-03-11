import { format } from "date-fns";

export function dateChecker(req, res, next) {
  const time = format(new Date(), "yyyy-MM-dd");
  if (time >= "2022-03-12") {
    return res.status(403).json({
      error: {
        message: "지원기간이 끝났습니다.",
      },
    });
  }
  return next();
}
