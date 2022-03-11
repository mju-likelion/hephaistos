require("date-utils");

export function dateChecker(req, res, next) {
  const newDate = new Date();
  const time = newDate.toFormat("YYYY-MM-DD");
  if (time >= "2022-03-12") {
    return res.status(403).json({
      error: {
        message: "지원기간이 끝났습니다.",
      },
    });
  }
  return next();
}
