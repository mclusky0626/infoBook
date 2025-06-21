import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import user from "../assets/User.svg"
import "./PersonDetailPage.css"

const PersonDetailPage: React.FC = () => {
  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "people", id)).then(snap => {
      if (snap.exists()) setPerson(snap.data());
      else navigate("/encyclopedia");
    });
  }, [id, navigate]);

  if (!person) return <div>불러오는 중...</div>;

  return (
    <div className="detail-bg">
    <div className="person-detail-root">
  <div className="person-detail-main">
    <div className="person-detail-avatar">
      <img src={user} alt="프로필" />
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
    <button onClick={() => navigate(-1)}>목록으로</button>
  </div>
</div>
</div>

  );
};
export default PersonDetailPage;
