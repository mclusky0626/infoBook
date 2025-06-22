import React, { useEffect, useState } from "react";
import "./Encyclopedia.css";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuth";
import { useUserInfo } from "../hooks/useUserInfo";
import search from "../assets/search.svg";
import plus from "../assets/Plus.svg";
import left from "../assets/Chevron Left.svg";
import right from "../assets/Chevron Right.svg";
import userIcon from "../assets/User.svg";

const INITIAL_TAGS = ["친구", "같은반", "가족", "형", "누나", "지인"];
const INITIAL_CHO = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

function getCho(str: string) {
  // 한글 초성 추출
  const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const uni = str.charCodeAt(0) - 0xac00;
  if (uni < 0 || uni > 11171) return str[0]; // 한글 아닌 경우
  return cho[Math.floor(uni / 588)];
}

type Person = {
  id: string;
  name: string;
  contact?: string;
  tags: string[];
  description: string;
  detail?: string;
  createdAt: unknown;
};

const TAG_COLORS: Record<string, string> = {
  "친구": "#eff6ff", "같은반": "#f0fdf4", "가족": "#fdf2f8", "형": "#fef3c7", "사촌": "#ecfdf5"
};

const EncyclopediaPage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCho, setSelectedCho] = useState<string>("ㄱ");
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", contact: "", tags: [] as string[], description: "", detail: "" });
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const user = useAuthUser();
  const uidForInfo = user === null ? null : user?.uid;
  const info = useUserInfo(uidForInfo);

  useEffect(() => {
    if (user === undefined || info === undefined) return;
    if (!user) {
      navigate("/login");
    } else if (info && !info.canAccess) {
      alert("열람 권한이 없습니다.");
      navigate("/");
    }
  }, [user, info, navigate]);

  // Firestore에서 실시간으로 people 가져오기
  useEffect(() => {
    const q = query(
      collection(db, "people"),
      orderBy("name", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      const arr: Person[] = [];
      snap.forEach(docu => {
        const data = docu.data();
        arr.push({ id: docu.id, ...data } as Person);
      });
      setPeople(arr);
    });
    return () => unsub();
  }, []);

  if (user === undefined || info === undefined) {
    return <div className="main-container">불러오는 중...</div>;
  }
  if (!user || !info.canAccess) {
    return null;
  }

  // 초성별 필터 & 검색
  const filtered = people.filter(p => {
    const nameCho = getCho(p.name);
    return (
      (!selectedCho || nameCho === selectedCho) &&
      (!searchValue || p.name.includes(searchValue))
    );
  });

  // 페이징 (10개씩)
  const PER_PAGE = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  // 새 문서 저장
  const saveNewPerson = async () => {
    setError(null);
    if (!newPerson.name.trim()) {
      setError("이름은 필수입니다!");
      return;
    }
    await addDoc(collection(db, "people"), {
      ...newPerson,
      createdAt: new Date(),
    });
    setShowNewDoc(false);
    setNewPerson({ name: "", contact: "", tags: [], description: "", detail: "" });
  };

  // 태그 체크
  const handleTagClick = (tag: string) => {
    setNewPerson((cur) => ({
      ...cur,
      tags: cur.tags.includes(tag)
        ? cur.tags.filter((t) => t !== tag)
        : [...cur.tags, tag],
    }));
  };

  return (
    <div className="encyclopedia-page">
      <div className="header">
        <div className="div">인물 백과사전</div>
        <div className="search-section">
          <div className="search-bar">
            <img className="search" src={search} alt="search"/>
            <input
              style={{ border: "none", outline: "none", flex: 1, fontSize: 16, background: "transparent" }}
              placeholder="인물 이름을 검색하세요..."
              value={searchValue}
              onChange={e => { setSearchValue(e.target.value); setPage(1); }}
            />
          </div>
          <div className="new-document-button" onClick={() => setShowNewDoc(true)} style={{ cursor: "pointer" }}>
            <img className="plus" src={plus} alt="plus"/>
            <div className="div3">새 문서 작성</div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="alphabet-navigation">
          <div className="div4">인물 목록</div>
          <div className="korean-alphabet">
            {INITIAL_CHO.map((cho) => (
              <div
                key={cho}
                className={cho === selectedCho ? "div5" : "div7"}
                style={{ cursor: "pointer" }}
                onClick={() => { setSelectedCho(cho); setPage(1); }}
              >
                <div className={cho === selectedCho ? "div6" : "div8"}>{cho}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="person-list">
          <div className="_24">
            {selectedCho}으로 시작하는 인물 ({filtered.length}명)
          </div>
          <div className="person-cards">
            {paged.map((p) => (
              <div
                className="person-card-1"
                key={p.id}
                onClick={() => navigate(`/encyclopedia/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="avatar">
                  <img className="user" src={userIcon} alt="user"/>
                </div>
                <div className="person-info">
                  <div className="div9">{p.name}</div>
                  <div className="div10">{p.contact}</div>
                  <div className="tags">
                    {(p.tags || []).map((tag, ti) => (
                      <div
                        key={ti}
                        className="tag-1"
                        style={{ background: TAG_COLORS[tag] || "#e0e7ff" }}
                      >
                        <div className="div11">{tag}</div>
                      </div>
                    ))}
                  </div>
                  <div className="div10" style={{ marginTop: 2, fontSize: 13 }}>{p.description}</div>
                </div>
                <img src={right} style={{width:22, marginLeft:"auto"}} alt="상세"/>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pagination">
        <div className="page-info">
          <div className="_156">총 {filtered.length}명의 인물</div>
          <div className="pagination-controls">
            <div className="previous"
              style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "default" : "pointer" }}
              onClick={() => page > 1 && setPage(page-1)}
            >
              <img className="chevron-left" src={left} alt="이전"/>
              <div className="div18">이전</div>
            </div>
            {[...Array(pageCount)].map((_, idx) => (
              <div
                key={idx+1}
                className={page === idx+1 ? "page-1" : "page-2"}
                style={{ cursor: "pointer" }}
                onClick={() => setPage(idx+1)}
              >
                <div className={page === idx+1 ? "_1" : "_2"}>{idx+1}</div>
              </div>
            ))}
            <div className="next"
              style={{ opacity: page === pageCount ? 0.5 : 1, cursor: page === pageCount ? "default" : "pointer" }}
              onClick={() => page < pageCount && setPage(page+1)}
            >
              <div className="div18">다음</div>
              <img className="chevron-right6" src={right} alt="다음"/>
            </div>
          </div>
        </div>
      </div>
      {/* 새 문서 작성 모달 */}
      {showNewDoc && (
        <div className="modal-bg" style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.13)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 40, minWidth: 340, boxShadow: "0 2px 16px #0002",
            display: "flex", flexDirection: "column", gap: 14, maxWidth: 500
          }}>
            <h2 style={{ color: "#23236c" }}>새 인물 등록</h2>
            <input
              placeholder="이름(필수)"
              value={newPerson.name}
              onChange={e => setNewPerson(np => ({ ...np, name: e.target.value }))}
              style={{ padding: "12px", borderRadius: 7, border: "1px solid #ccd", fontSize: 17, marginBottom: 8 }}
            />
            <input
              placeholder="연락처(선택)"
              value={newPerson.contact}
              onChange={e => setNewPerson(np => ({ ...np, contact: e.target.value }))}
              style={{ padding: "12px", borderRadius: 7, border: "1px solid #ccd", fontSize: 17, marginBottom: 8 }}
            />
            <textarea
              placeholder="간단 설명"
              value={newPerson.description}
              onChange={e => setNewPerson(np => ({ ...np, description: e.target.value }))}
              style={{ padding: "12px", borderRadius: 7, border: "1px solid #ccd", fontSize: 16, minHeight: 50, marginBottom: 8 }}
            />
            <textarea
              placeholder="세부 설명 (선택)"
              value={newPerson.detail || ""}
              onChange={e => setNewPerson(np => ({ ...np, detail: e.target.value }))}
              style={{ padding: "12px", borderRadius: 7, border: "1px solid #ccd", fontSize: 16, minHeight: 90, marginBottom: 8 }}
            />
            <div style={{ margin: "10px 0 4px 0", fontWeight: 500 }}>태그</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {INITIAL_TAGS.map(tag => (
                <div
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  style={{
                    background: newPerson.tags.includes(tag) ? "#2563eb" : "#f1f5f9",
                    color: newPerson.tags.includes(tag) ? "#fff" : "#1e293b",
                    borderRadius: 14, padding: "8px 18px", fontSize: 16, cursor: "pointer",
                    border: newPerson.tags.includes(tag) ? "2px solid #2563eb" : "1px solid #dbeafe",
                    userSelect: "none"
                  }}>
                  {tag}
                </div>
              ))}
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={saveNewPerson}
                style={{
                  background: "#2563eb", color: "#fff", padding: "11px 32px", border: "none", borderRadius: 7, fontSize: 17, fontWeight: 700, cursor: "pointer"
                }}>
                저장
              </button>
              <button onClick={() => { setShowNewDoc(false); setError(null); }}
                style={{
                  background: "#eee", color: "#23236c", padding: "11px 24px", border: "none", borderRadius: 7, fontSize: 16, fontWeight: 500, cursor: "pointer"
                }}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncyclopediaPage;
