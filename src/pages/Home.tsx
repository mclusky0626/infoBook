import React from "react";
import "./Home.css";

const Home: React.FC = () => (
  <div className="main-container">
    <div className="home-title">배건우의 인물 백과사전</div>
    <div className="home-desc">
      안녕하세요!<br />
      이 웹사이트는 다양한 인물들의 정보를 초성별로 정리한 백과사전입니다.<br />
      상단 메뉴에서 <b>인물백과사전</b>을 눌러 인물들을 탐색하거나, <b>로그인</b>을 통해 관리자로 접속해보세요.
    </div>
  </div>
);

export default Home;
