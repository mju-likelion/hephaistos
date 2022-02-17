// 이메일 주소 시작은 숫자나 알파벳(소/대문자)로 시작한다.
// 이메일 첫째자리 뒤에는 -_.을 포함하여 들어올 수 있다.
// 도메인 주소 전에는 @가 들어와야 한다.
// .이 최소한 하나는 있어야 하며 마지막 마디는 2-3자리여야 한다.
const regEmail =
  /^[0-9a-zA-Z-_]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
const regPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
const regPhone = /^[0-9]{11,11}$/;
const regName = /^[ㄱ-ㅎ|가-힣]{2,5}$/;

export function signValidator(req, res, next) {
  // eslint-disable-next-line
  const { email, password, phone, major, name } = req.body;
  if (!email || !password || !phone || !major || !name) {
    return res.status(400).json({
      error: {
        message: "회원가입 형식이 올바르지 않습니다.",
      },
    });
  }

  if (!regEmail.test(email) && email.length > 30) {
    return res.status(400).json({
      error: {
        message: "이메일 형식이 올바르지 않습니다.",
      },
    });
  }
  // 8~20자리 이내, 비밀번호는 공백 없이, 영문,숫자,특수문자 혼합
  // TODO: 각각의 케이스에 대해 에러메세지를 추가해야 함
  if (!regPassword.test(password)) {
    return res.status(400).json({
      error: {
        message: "비밀번호는 공백 없이, 영문,숫자,특수문자 혼합한 8~20자로 입력해주세요",
      },
    });
  }
  // 숫자로만 이루어져있는지 11글자인지
  if (!regPhone.test(phone)) {
    return res.status(400).json({
      error: {
        message: "phone는 -를 제외한 11자를 입력해주세요.",
      },
    });
  }
  if (!regName.test(name)) {
    return res.status(400).json({
      error: {
        message: "name은 한글로 5글자 이하를 입력해주세요.",
      },
    });
  }
  if (major.length > 15) {
    return res.status(400).json({
      error: {
        message: "major는 15자이하를 입력해주세요.",
      },
    });
  }
  return next();
}

export function emailValidator(req, res, next) {
  // eslint-disable-next-line
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      error: {
        message: "회원가입 형식이 올바르지 않습니다.",
      },
    });
  }
  if (!regEmail.test(email) || email.length > 30) {
    return res.status(400).json({
      error: {
        message: "회원가입 형식이 올바르지 않습니다.", // 이메일인증 단계에서 실패
      },
    });
  }
  return next();
}

export function loginValidator(req, res, next) {
  // eslint-disable-next-line
  const { email, password } = req.body;
  if (!regEmail.test(email) || email.length > 30) {
    return res.status(400).json({
      error: {
        message: "이메일 형식이 올바르지 않습니다.",
      },
    });
  }
  if (!regPassword.test(password)) {
    return res.status(400).json({
      error: {
        message: "비밀번호는 공백 없이, 영문,숫자,특수문자 혼합한 8~20자로 입력해주세요",
      },
    });
  }
  return next();
}
