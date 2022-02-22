
# Movie Introduce App

## TheMoviedb API 를 이용한 영화소개 어플

 ### 사용한 라이브러리
 * React
  * Typescript
  * React-query
  * Hooks
  * react-hook-form
  * Styled-compotnents
  * Framer-motion 
### 주요기능
  * 영화에대한정보를보
  * 예고편을볼수있는 비디오가 재생
  * 영화검색
  
  > NETFLIX 의 디자인을 참고하여 모든기능은 아니지만 느낌을 살리며 만들어봤습니다
  > 미흡한부분들이 눈에 계속 보이며 수정을 거듭하며 만들었지만, 아직도 손볼곳이 많아서 추후에 기능을 더해가며 업데이트해보려고합니다
  > api로 요청한데이터가 생각보다 많을때는 매순간 랜더링될때 서버에서 요청하는방식 으로는 랜더링시 버벅이는 현상과 이 있어서
  > 반복적인 api로 서버에 요청하기보단 이미요청해서 받은데이터를 캐시에 저장하여 사용할수있는 React-query를 사용해봤습니다.
  > 애니메이션 을 구현할때 styled-component 와 frmaer-motion 의 궁합이 좋아서 작업하기 에 편하였습니다.
  
  [사이트로 이동](https://elastic-jackson-cc9987.netlify.app)
  
![movie1](https://user-images.githubusercontent.com/80139780/155116026-37004d4c-727c-4e69-8d00-b201ac9e4a79.gif)

  
![Movie Data - Chrome 2022-02-22 오후 7_11_54](https://user-images.githubusercontent.com/80139780/155115799-ff18a051-cb75-4333-b020-9e05c6a28330.png)
