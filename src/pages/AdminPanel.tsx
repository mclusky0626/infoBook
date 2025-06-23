import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { useAuthUser } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ToggleSwitch from "../components/ToggleSwitch";

const ADMIN_EMAIL = "joshuabae0626@gmail.com";

type UserInfo = {
  id: string;
  email: string;
  canAccess: boolean;
  isAdmin: boolean;
};

const AdminPanel: React.FC = () => {
  const user = useAuthUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserInfo[]>([]);

  // 권한 체크
  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      navigate("/login");
    } else if (user.email !== ADMIN_EMAIL) {
      alert("관리자만 접근 가능합니다.");
      navigate("/");
    }
  }, [user, navigate]);

  // 실시간 users 목록 불러오기
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    const unsubscribe = onSnapshot(collection(db, "users"), snap => {
      const userList: UserInfo[] = [];
      snap.forEach(docu => {
        const data = docu.data();
        userList.push({
          id: docu.id,
          email: data.email,
          canAccess: !!data.canAccess,
          isAdmin: !!data.isAdmin,
        });
      });
      setUsers(userList);
    });
    return () => unsubscribe();
  }, [user]);

  // ON/OFF 토글
  const toggleAccess = async (uid: string, current: boolean) => {
    await updateDoc(doc(db, "users", uid), { canAccess: !current });
  };

  return (
    <div className="main-container">
      <h2>권한 관리</h2>
      <table style={{ width: "100%", marginTop: 30, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f4ff", color: "#23236c" }}>
            <th style={{ padding: 10 }}>이메일</th>
            <th style={{ padding: 10 }}>어드민</th>
            <th style={{ padding: 10 }}>인물백과 열람</th>
            <th style={{ padding: 10, textAlign: "center" }}>권한 ON/OFF</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: "1px solid #e0e0ef" }}>
              <td style={{ padding: 10 }}>{u.email}</td>
              <td style={{ padding: 10, textAlign: "center" }}>{u.isAdmin ? "👑" : ""}</td>
              <td style={{ padding: 10, textAlign: "center" }}>
                {u.canAccess ? <span style={{ color: "green" }}>ON</span> : <span style={{ color: "gray" }}>OFF</span>}
              </td>
              <td style={{ padding: 10, textAlign: "center" }}>
                {u.email === ADMIN_EMAIL ? (
                  <span style={{ color: "#aaa" }}>-</span>
                ) : (
                  <ToggleSwitch
                    checked={u.canAccess}
                    onChange={() => toggleAccess(u.id, u.canAccess)}
                    disabled={false}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
