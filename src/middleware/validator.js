// email, password, name, phone, apply_univ, major, email_verify, status
exports.signVaildator = (req, res, next) => {
  // eslint-disable-next-line
  const { email, password, phone } = req.body;
  // 이메일 주소 시작은 숫자나 알파벳(소/대문자)로 시작한다.
  // 이메일 첫째자리 뒤에는 -_.을 포함하여 들어올 수 있다.
  // 도메인 주소 전에는 @가 들어와야 한다.
  // .이 최소한 하나는 있어야 하며 마지막 마디는 2-3자리여야 한다.
  const regEmail =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
  const num = password.search(/[0-9]/g);
  const eng = password.search(/[a-z]/gi);
  const spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
  const check = /^[0-9]*$/;

  if (!regEmail.test(email)) {
    return res.status(400).json({
      error: {
        message: "회원가입 형식이 올바르지 않습니다.",
      },
    });
  }
  // 8~20자리 이내, 비밀번호는 공백 없이, 영문,숫자,특수문자 혼합
  if (
    password.length < 8 &&
    password.length > 20 &&
    password.search(/\s/) !== -1 &&
    num < 0 &&
    eng < 0 &&
    spe < 0
  ) {
    return res.status(400).json({
      error: {
        message: "회원가입 형식이 올바르지 않습니다.",
      },
    });
  }
  // 숫자로만 이루어져있는지 11글자인지
  if (!check.test(phone) && !phone.length === 11) {
    return res.status(400).json({
      error: {
        message: "회원가입 형식이 올바르지 않습니다.",
      },
    });
  }
  return next();
};

exports.emailVaildator = (req, res, next) => {
  // eslint-disable-next-line
  const { email } = req.body;
  const regEmail = /([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  if (!regEmail.test(email)) {
    return res.status(400).json({
      error: {
        message: "회원가입 형식이 올바르지 않습니다.", // 이메일인증 단계에서 실패
      },
    });
  }
  return next();
};
