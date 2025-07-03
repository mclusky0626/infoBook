import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthUser } from "../hooks/useAuth";
import { useUserInfo } from "../hooks/useUserInfo";
import "./PersonEditPage.css";

const INITIAL_TAGS = ["친구", "같은반", "가족", "형", "누나", "지인"];

type Person = {
  name: string;
  contact?: string;
  description: string;
  tags: string[];
  detail?: string;
};

const PersonEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthUser();
  const info = useUserInfo(user?.uid);
  const [person, setPerson] = useState<Person | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user === undefined || info === undefined) return;
    if (user === null) {
      navigate("/login");
    } else if (!info?.canAccess) {
      alert("수정 권한이 없습니다.");
      navigate(id ? `/encyclopedia/${id}` : "/encyclopedia");
    }
  }, [user, info, navigate, id]);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "people", id)).then(snap => {
      if (snap.exists()) setPerson(snap.data() as Person);
      else navigate("/encyclopedia");
    });
  }, [id, navigate]);

  if (user === undefined || info === undefined || person === null) {
    return <div className="main-container">불러오는 중...</div>;
  }
  if (user === null || !info?.canAccess) return null;

  const toggleTag = (tag: string) => {
    setPerson(cur =>
      cur
        ? {
            ...cur,
            tags: cur.tags.includes(tag)
              ? cur.tags.filter(t => t !== tag)
              : [...cur.tags, tag],
          }
        : cur
    );
  };

  // 로그 추가
  const save = async () => {
    console.log("=== [수정 시도] ===");
    console.log("person 값:", person);
    if (!person.name.trim()) {
      setError("이름은 필수입니다!");
      return;
    }
    try {
      await updateDoc(doc(db, "people", id!), person);
      console.log("Firestore 업데이트 성공!");
      navigate(`/encyclopedia/${id}`);
    } catch (err) {
      console.error("Firestore 업데이트 실패:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError("수정에 실패했습니다: " + msg);
    }
  };

  return (
    <div className="main-container">
      <div className="edit-container">
        <h2>문서 수정</h2>
        <input
          placeholder="이름"
          value={person.name}
          onChange={e => setPerson(p => p && { ...p, name: e.target.value })}
        />
        <input
          placeholder="연락처(선택)"
          value={person.contact || ""}
          onChange={e => setPerson(p => p && { ...p, contact: e.target.value })}
        />
        <textarea
          placeholder="간단 설명"
          value={person.description}
          onChange={e => setPerson(p => p && { ...p, description: e.target.value })}
        />
        <textarea
          placeholder="세부 설명 (선택)"
          value={person.detail || ""}
          onChange={e => setPerson(p => p && { ...p, detail: e.target.value })}
        />
        <div style={{ margin: "10px 0 4px 0", fontWeight: 500 }}>태그</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {INITIAL_TAGS.map(tag => (
            <div
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                background: person.tags.includes(tag) ? "#2563eb" : "#f1f5f9",
                color: person.tags.includes(tag) ? "#fff" : "#1e293b",
                borderRadius: 14,
                padding: "8px 18px",
                fontSize: 16,
                cursor: "pointer",
                border: person.tags.includes(tag)
                  ? "2px solid #2563eb"
                  : "1px solid #dbeafe",
                userSelect: "none",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={save}
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "11px 32px",
              border: "none",
              borderRadius: 7,
              fontSize: 17,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            저장
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "#eee",
              color: "#23236c",
              padding: "11px 24px",
              border: "none",
              borderRadius: 7,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonEditPage;
