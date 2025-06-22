import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import userIcon from "../assets/User.svg"
import "./PersonDetailPage.css"
import { useAuthUser } from "../hooks/useAuth";
import { useUserInfo } from "../hooks/useUserInfo";

type Person = {
  name: string;
  contact?: string;
  description: string;
  tags: string[];
  detail?: string;
};

const PersonDetailPage: React.FC = () => {
  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();
  const user = useAuthUser();
  const info = useUserInfo(user?.uid);
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (user === undefined || info === undefined) return;
    if (user === null) {
      navigate("/login");
    } else if (info && !info.canAccess) {
      alert("열람 권한이 없습니다.");
      navigate("/");
    }
  }, [user, info, navigate]);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "people", id)).then(snap => {
      if (snap.exists()) setPerson(snap.data() as Person);
      else navigate("/encyclopedia");
    });
  }, [id, navigate]);

  if (user === undefined || info === undefined || !person) {
    return <div>불러오는 중...</div>;
  }
  if (user === null || !info?.canAccess) return null;

  return (
    <div className="detail-bg">
      <div className="person-detail-root">
        <div className="person-detail-main">
          <div className="person-detail-avatar">
            <img src={userIcon} alt="프로필" />
          </div>
          <div className="person-detail-info">
            <div className="person-detail-name">{person.name}</div>
            <div className="person-detail-contact">연락처: {person.contact || "-"}</div>
            <div className="person-detail-desc">{person.description}</div>
            <div className="person-detail-tags">
              {person.tags && person.tags.map((tag:string, i:number) => (
                <span className="person-detail-tag" key={i}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
        {person.detail &&
          <div className="person-detail-section">
            <b>세부 설명</b>
            {person.detail}
          </div>
        }
        <div className="person-detail-back">
          {info.canAccess && (
            <button
              onClick={() => navigate(`/encyclopedia/${id}/edit`)}
              style={{ marginRight: 8 }}
            >
              수정
            </button>
          )}
          <button onClick={() => navigate(-1)}>목록으로</button>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;
