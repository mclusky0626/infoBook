import React from "react";
import "./Home.css";

const Home: React.FC = () => (
  <div className="main-container">
    <div className="home-title">배건우의 웹사이트</div>
    <div className="home-desc">
      안녕하세요!<br />
      이 웹사이트는 배건우가 만든 다양한 작품들이 있는 웹사이트 입니다.<br />
      상단 메뉴에서 <b>인물백과사전</b>을 눌러 인물들을 탐색하거나, <b>로그인</b>을 통해 계정을 생성하거나 만들어 보세요
    </div>
  </div>
);

export default Home;
