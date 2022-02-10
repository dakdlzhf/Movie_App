import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import styled, { createGlobalStyle } from "styled-components";
import { QueryClientProvider, QueryClient } from "react-query";
import "./index.css";

const GlobalStyle = createGlobalStyle`

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
  overflow-y:scroll; // 엘리먼트가 유무에따라 화면이 흔들릴때 스크롤바때문인데 아예나와있게만들면 흔들리지않는다
  overflow-x: hidden; //가로스크롤바 숨기기
  /* overflow-y:hidden; */  //세로스크롤바 숨기기 데이터검색할때 콘텐츠들이 생기고 없어질때 흔들림을 없애기위해
  background-color:black;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
  *{
    box-sizing:border-box;
  }
  body{
    font-family:'Source sans Pro', sans-serif;
    font-weight:300;
    line-height:1.2;

  }
  a{
    text-decoration:none;
    color:inherit;
  }
`;
const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <GlobalStyle />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
