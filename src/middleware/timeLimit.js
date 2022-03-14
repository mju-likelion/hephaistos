import { compareAsc } from "date-fns";

export function dateChecker(req, res, next) {
  // 두 날짜를 비교하고 첫 번째 날짜가 두 번째 날짜 이후이면 1, 이전이면 -1, 날짜가 같으면 0을 반환
  if (compareAsc(new Date(), new Date(2022, 2, 11, 13, 30)) === 1) {
    return res.status(403).json({
      error: {
        message: "지원기간이 끝났습니다.",
      },
    });
  }
  return next();
}
