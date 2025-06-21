import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import user from "../assets/User.svg"
import "./PersonDetailPage.css"

type Props = { isAdmin?: boolean }
const TAGS = ["친구", "같은반", "가족", "형","누나","지인"];

const PersonDetailPage: React.FC<Props> = ({ isAdmin = false }) => {
  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "people", id)).then(snap => {
      if (snap.exists()) setPerson({ id: snap.id, ...snap.data() });
      else navigate("/encyclopedia");
    });
  }, [id, navigate]);

  // 수정 제출
  const handleEditSubmit = async (updated:any) => {
    if (!id) return;
    await updateDoc(doc(db, "people", id), updated);
    setPerson((cur:any) => ({ ...cur, ...updated }));
    setShowEdit(false);
  };

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
            <div style={{whiteSpace:"pre-line"}}>{person.detail}</div>
          </div>
        }
        <div className="person-detail-back" style={{display:"flex", gap:10}}>
          <button onClick={() => navigate(-1)}>목록으로</button>
          {isAdmin && <button className="edit-btn" onClick={()=>setShowEdit(true)}>수정</button>}
        </div>
      </div>
      {/* --- 수정 모달 --- */}
      {showEdit &&
        <PersonEditModal
          person={person}
          onClose={()=>setShowEdit(false)}
          onSave={handleEditSubmit}
        />
      }
    </div>
  );
};

export default PersonDetailPage;

/* --- 수정 모달 컴포넌트 --- */
function PersonEditModal({ person, onClose, onSave }:{
  person:any, onClose:()=>void, onSave:(upd:any)=>void
}) {
  const [state, setState] = useState({
    name: person.name || "",
    contact: person.contact || "",
    description: person.description || "",
    detail: person.detail || "",
    tags: person.tags || [],
  });
  const [error, setError] = useState("");

  function handleTag(tag:string) {
    setState(cur => ({
      ...cur,
      tags: cur.tags.includes(tag)
        ? cur.tags.filter((t:string)=>t!==tag)
        : [...cur.tags, tag]
    }));
  }
  function handleSave() {
    if (!state.name.trim()) return setError("이름은 필수입니다!");
    onSave(state);
  }

  return (
    <div className="person-edit-modal-bg">
      <div className="person-edit-modal">
        <h3>인물 정보 수정</h3>
        <input
          value={state.name}
          onChange={e=>setState(s=>({...s, name:e.target.value}))}
          placeholder="이름 (필수)"
        />
        <input
          value={state.contact}
          onChange={e=>setState(s=>({...s, contact:e.target.value}))}
          placeholder="연락처"
        />
        <textarea
          value={state.description}
          onChange={e=>setState(s=>({...s, description:e.target.value}))}
          placeholder="간단 설명"
        />
        <textarea
          value={state.detail}
          onChange={e=>setState(s=>({...s, detail:e.target.value}))}
          placeholder="세부 설명"
          style={{minHeight:80}}
        />
        <div style={{margin:"10px 0 4px 0"}}>태그</div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          {TAGS.map(tag => (
            <div key={tag}
              style={{
                background: state.tags.includes(tag) ? "#2563eb" : "#f1f5f9",
                color: state.tags.includes(tag) ? "#fff" : "#1e293b",
                borderRadius:14, padding:"6px 14px", fontSize:15, cursor:"pointer",
                border: state.tags.includes(tag) ? "2px solid #2563eb":"1px solid #dbeafe",
                userSelect:"none"
              }}
              onClick={()=>handleTag(tag)}
            >{tag}</div>
          ))}
        </div>
        {error && <div style={{color:"red"}}>{error}</div>}
        <div style={{display:"flex", gap:8, marginTop:14}}>
          <button onClick={handleSave} className="edit-btn-main">저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
