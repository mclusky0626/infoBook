import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth,db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { setDoc, doc, getDoc } from "firebase/firestore";



const ADMIN_EMAIL = "joshuabae0626@gmail.com";
const ensureUserDoc = async (user: any) => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: user.email,
        isAdmin: user.email === ADMIN_EMAIL,
        canAccess: user.email === ADMIN_EMAIL, // 어드민만 기본 ON
      });
    }
  };

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      if (isLogin) {
        const cred = await signInWithEmailAndPassword(auth, email, pw);
        await ensureUserDoc(cred.user);      // << 여기!
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, pw);
        await ensureUserDoc(cred.user);      // << 여기!
      }
      navigate("/");
    } catch (error: any) {
      setErr(error.message || "오류가 발생했습니다.");
    }
  };
  

  return (
    <div className="main-container login-bg">
    <div className="login-container">
      <h2>{isLogin ? "로그인" : "회원가입"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          required
          onChange={e => setPw(e.target.value)}
        />
        {err && <div className="error">{err}</div>}
        <button type="submit">
          {isLogin ? "로그인" : "회원가입"}
        </button>
      </form>
      <div className="switch">
        {isLogin
          ? <>계정이 없으신가요?{" "}
              <span onClick={() => setIsLogin(false)}>
                회원가입
              </span>
            </>
          : <>이미 계정이 있으신가요?{" "}
              <span onClick={() => setIsLogin(true)}>
                로그인
              </span>
            </>
        }
      </div>
    </div>
    </div>
  );
};

export default Login;
