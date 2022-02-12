/* @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Nanum+Pen+Script&display=swap'); */
import { useQuery } from "react-query";
import styled, { keyframes } from "styled-components";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import {CgArrowUpR,CgArrowDownR} from 'react-icons/cg'
import { MdAddCircle } from "react-icons/md";
import {
  API_KEY,
  BASE_PATH,
  getPopularMovieFetch,
  IGetApi,
  IGetListApi,
  IVideo,
} from "../api";
import { makeImagePath } from "../utils";
import {
  motion,
  AnimatePresence,
  useViewportScroll,
  useAnimation,
} from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import ReactPlayer from "react-player";
import { useForm } from "react-hook-form";
import _ from "lodash";

const Wrapper = styled.div`
  height: 100vh;
`;
const Banner = styled.div`
  height: 1000px;
  background-color: white;
  overflow: hidden;
`;
const BannerParent = styled(motion.div)`
  margin-top: 50px;
  width: 1100vw;
  height: inherit;
  margin-bottom: 10px;
  background-color: black;
`;
const keyframeSlide = keyframes`
    0%{transform:translateX(0)}
    9%{transform:translateX(0)}
    10%{transform:translateX(-100vw)}

    19%{transform:translateX(-100vw)}
    20%{transform:translateX(-200vw)}

    29%{transform:translateX(-200vw)}
    30%{transform:translateX(-300vw)}

    39%{transform:translateX(-300vw)}
    40%{transform:translateX(-400vw)}

    49%{transform:translateX(-400vw)}
    50%{transform:translateX(-500vw)}

    59%{transform:translateX(-500vw)}
    60%{transform:translateX(-600vw)}

    69%{transform:translateX(-600vw)}
    70%{transform:translateX(-700vw)}

    79%{transform:translateX(-700vw)}
    80%{transform:translateX(-800vw)}

    89%{transform:translateX(-800vw)}
    90%{transform:translateX(-900vw)}

    99%{transform:translateX(-900vw)}
    100%{transform:translateX(-900vw)}

`;

const BannerChildren = styled(motion.div)`
  float: left;
  display: flex;
  width: 100vw;
  height: inherit;
  animation-name: ${keyframeSlide};
  animation-duration: 60s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-direction: alternate; /* 방향전환 */
  padding: 50px;
`;
const ImageItem = styled(motion.div)<{ backgroundimage: string }>`
  width: 60%;
  height: inherit;
  background-image: url(${(props) => props.backgroundimage});
  background-position: center center;
  background-size: 100% auto;
  max-height: 100%;
  max-width: 100%;
  background-repeat: no-repeat;
  overflow: hidden;
`;
const TextItem = styled(motion.div)`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  padding: 30px;
  color: white;
`;
const InnerTitle = styled(motion.h2)`
  font-family: "Montserrat", sans-serif;
  font-size: 5vw;
  font-weight: bold;
  margin-bottom: 20px;
`;
const InnerOverview = styled(motion.div)`
  font-family: "Montserrat", sans-serif;
  font-size: 2vw;
  display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  line-height: 1.8;
  overflow: hidden;
`;

const InnerButton = styled(motion.button)`
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    transition: transform 1s;
  }
`;

const Loder = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.div`
  width: 100%;
  font-size: 50px;
  color: yellow;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
`;
const Overview = styled.div`
  width: 30%;
  font-size: 25px;
  color: white;
  font-family: "Montserrat", sans-serif;
`;
const Slider = styled.div`
  position: relative;
  top: -30px;
`;
const MovieList = styled.div`
  position: relative;
  width: 100%;
  top: 670px;
`;
const ListMoreBtn = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  width: 100%;
  height: 45px;
  border-radius: 5px;
  font-size: 30px;
  margin-top: 100px;
`;
const ListText = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 45px;
  border-radius: 20px;
  color: white;
  background-color: #eb2f06;
  font-family: "Montserrat", sans-serif;
  cursor: pointer;
  div {
    padding-top: 8px;
    font-size: 2.5rem;
  }
`;
const FirstTextWrapper = styled.div`
  position: relative;
  top: 0px;
`;
const InfoText = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: white;
  margin-top: 40px;
  margin-left: 40px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
`;
const NextButton = styled(motion.div)`
  width: 150px;
  height: 40px;
  border-radius: 20px;
  font-size: 30px;
  background-color: rgb(25, 42, 86);
  margin-left: 30px;
  text-align: center;
  div {
    cursor: pointer;
  }
`;
const Svg = styled.svg`
  z-index: 2100;
  position: fixed;
  top: 28px;
  right: 30px;
  width: 100px;
  height: 100px;
`;
const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 5px;
  margin-top: 20px;
  padding: 40px;
`;

const Col = styled(motion.div)<{ backgroundimage: string }>`
  width: 100%;
  height: 300px;
  background-position: center center;
  background-size: cover;
  max-height: 90%;
  max-width: 90%;
  margin: auto;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.backgroundimage});
  position: relative;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  &:hover {
    z-index: 2000;
  }
`;
const ColShadow = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: inherit;
  text-align: center;
  overflow: hidden;
  div {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    margin-top: 300px;
    padding: 8px;
    transition: margin-top 1s;
    h3 {
      font-size: 15px;
      font-weight: bold;
      font-family: "Montserrat", sans-serif;
    }
  }
  &:hover > div {
    margin-top: 220px;
    color: white;
  }
`;

const SecondSlide = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 5px;
  top: 400px;
  padding: 40px;
`;
const SecondTextWrapper = styled.div`
  position: relative;
  top: 350px;
`;
// 영화콘텐츠 클릭시 커지면서 나오는 디테일 창
const DetailWrapperFixed = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
  z-index: 100;
`;
const DetailInnerAbsolute = styled(motion.div)`
  position: absolute;
  width: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 20px;
  background-color: white;
  overflow: hidden;
  z-index: 100;
`;
const DetailOverview = styled.div`
  width: 100%;
  height: 300px;
  text-align: center;
  padding: 20px;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  font-size: 20px;
  word-spacing: 4px;
  line-height: 1.5;
  overflow: scroll;
  div {
    margin: 10px;
    font-size: 2rem;
    font-weight: bold;
    font-family: "Montserrat", sans-serif;
    color: #0c2461;
  }
`;
const DetailReleaseDate = styled.div`
  width: 100%;
  padding: 20px;
  text-align: center;
  font-family: "Montserrat", sans-serif;
`;
const DetailGrade = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #ff3f34;
  text-align: center;
  color: white;
  font-family: "Montserrat", sans-serif;
`;
//비디오 예고편이 없는 아이템 에러처리 이미지
const ErrorView = styled.div`
  width: 100%;
  height: 500px;
  padding: 50px;
  color: white;
  font-size: 35px;
  text-align: center;
  background-image: url("https://www.wallpapertip.com/wmimgs/99-996631_alone-sad-cardboard-box.jpg");
  background-position: center, center;
  background-size: cover;
`;
// 검색 박스
const SearchBox = styled(motion.input)`
  position: fixed;
  z-index: 1000;
  right: 30px;
  top: 88.5%;
  border: none;
  transform-origin: center right;
  width: 300px;
  height: 50px;
  border-radius: 20px;
  font-size: 25px;
  padding: 20px;
  font-family: "Montserrat", sans-serif;
`;
const FormWrapper = styled.form`
  svg {
    height: 40px;
    cursor: pointer;
  }
`;

// 스크롤 박스 Up,Down
const ScrollBoxUp = styled(motion.div)`
  position: fixed;
  top: 92%;
  right: 20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  color: white;
  z-index: 2100;
  cursor: pointer;
  text-align: center;
  line-height: 100px;
  h3 {
    font-size: 5rem;
  }
`;
const ScrollBoxDown = styled(motion.div)`
  position: fixed;
  top: 92%;
  right: 150px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  color: white;
  z-index: 2100;
  text-align: center;
  line-height: 100px;
  h3 {
    font-size: 5rem;
  }
`;
// Select 박스
const SelectBox = styled(motion.select)`
  z-index: 2100;
  position: fixed;
  top: 30px;
  right: 150px;
  border: none;
  border-radius: 10px;
  width: 15%;
  text-align: center;
  font-size: 28px;
  margin-left: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  option {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: bold;
  }
`;
//더보기 박스
const MoreBox = styled(motion.div)`
  z-index: 2100;
  position: fixed;
  top: 92%;
  right: 260px;
  width: 150px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 20px;
  background-color: #eb2f06;
  color: white;
  background-size: contain;
  cursor: pointer;
  h3 {
    font-size: 2.5rem;
    font-family: "Montserrat", sans-serif;
    font-weight: bold;
  }
`;
//Variants
const rowVariants = {
  /* 첫번째 슬라이드 variants */
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};
const secondRowVariants = {
  /* 두번째 슬라이드 variants */
  hidden: {
    x: -window.outerWidth - 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: +window.outerWidth + 10,
  },
};
const scrollVariants = {
  active: {
    scale: 0.9,
    transition: {
      duration: 1,
      type: "spring",
    },
  },
};

const buttonVariants = {
  initial: {
    opacity: 1,
  },
  active: {
    opacity: [0.5, 1, 0.5],
    transition: {
      type: "tween",
      repeat: Infinity,
      duration: 1,
    },
  },
};
const colVariants = {
  normal: {
    scale: 0.7,
  },
  hover: {
    scale: 1.2,
    y: -50,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type: "tween",
    },
  },
};
//Interface
interface IForm {
  keyword: string;
}
function Movie() {
  const { data, isLoading } = useQuery<IGetApi>("api", getPopularMovieFetch);
  const [secondData, setSecondData] = useState<IGetApi>();
  const [index, setIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [secondLeaving, setSecondLeaving] = useState(false);
  const currentUrl = useRouteMatch<{ id: string }>("/detail/:id");
  const [videoValue, setVideoValue] = useState<IVideo>();
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const offset = 5;
  const [isLoading0, setIsLoading0] = useState<boolean>(true);
  const [moreCount, setMoreCount] = useState(3);
  const inputAnimation = useAnimation();
  const BannerAnimation = useAnimation();
  const [searchClick, setSearchClick] = useState(false);
  const toggleHandle = () => {
    if (searchClick) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchClick((prev) => !prev);
  };
  /* 검색엔진 -------------------------------------------------- */
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ keyword }: IForm) => {
    // useForm 으로 input 에서받은데이터 state 에 보내는중
    setSearchKeyWord(keyword);
    setValue("keyword", "");
  };

  /* 스크롤이벤트함수 -------------------------------------*/
  const topMoveHandler = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  const BottomMoveHandler = () => {
    /*  document.body.scrollHeight = 스크롤최종높이 */
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };
  /* ----------------------------------스크롤이벤트함수END */
  const onClick = async (objectId: number) => {
    /*id값으로 해당 video 요청 로직  ------------------------*/
    const getVideoApi = async () => {
      return await fetch(
        `https://api.themoviedb.org/3/movie/${objectId}?api_key=f354ee7cde587f576652e7979db2f24a&language=${language}&append_to_response=videos,images`
      ).then((res) => res.json());
    };
    await getVideoApi().then((res) => {
      setVideoValue(res);
    });
    history.push(`/detail/${objectId}`);
    window.setTimeout(function () {
      history.push(`/detail/${objectId}`);
    }, 500);
  };
  /* List api 요청 -------------------------------------------------------------------------------*/
  let testArray: IGetListApi[] = [];
  const [test, setTest] = useState<IGetListApi[]>();
  const [btnSwitch, setBtnSwitch] = useState(false);
  const [language, setLanguage] = useState("ko-KR");
  useEffect(() => {
    /* MORE 클릭시 List api 요청 + count 증가 로직 -----------------------------------------------------*/
    for (var i = 2; i < moreCount; i++) {
      let apiGet1 = () => {
        return fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=f354ee7cde587f576652e7979db2f24a&language=${language}&page=${i}`
        ).then((response) => response.json());
      };
      apiGet1().then((res) => {
        testArray.push(...res.results);
        if (testArray) {
          setTest([...testArray]);
        }
      });
    }
  }, [moreCount, language]); /* count 값이 바뀔때 랜더링되게 조건등록 */
  /*select 를이용 언어 변경 로직 */
  const languageHandler = (e: string) => {
    if (e == "Korean") {
      setLanguage("ko-KR");
    } else {
      setLanguage("en-US");
    }
  };
  const moreIncrease = () => {
    setMoreCount((prev) => prev + 2);
    setIsLoading0(false);
  };
  /* 두번째슬라이드 api 요청 ---------------------------------------------------------------------*/
  useEffect(() => {
    const getTopMovieFetch = () => {
      return fetch(
        `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=3`
      ).then((res) => res.json());
    };
    getTopMovieFetch().then((res) => {
      setSecondData(res);
    });
  }, []);
  /* Count 증가함수 호출 && 스위치상태 변경 ---------------------------------------------------------*/
  const moreToggleBtn = () => {
    if (btnSwitch) {
      moreIncrease();
    } else {
      setBtnSwitch((prev) => !prev);
    }
  };
  const filterTest = test?.filter((val, index, arr) => {
    return (
      arr.findIndex((it) => {
        return it.id === val.id;
      }) === index
    );
  });

  const increaseIndex = () => {
    /* 첫번째슬라이드 index값증가에따라 슬라이드 key값변경해서 재랜더링 함 */
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const indexLength = data.results.length;
      const maxIndex = Math.floor(indexLength / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const secondincreaseIndex = () => {
    /* 두번째슬라이드 index값증가에따라 슬라이드 key값변경해서 재랜더링 함 */
    if (secondData) {
      if (secondLeaving) return;
      setSecondLeaving(true);
      const indexLength = secondData.results.length;
      const maxIndex = Math.floor(indexLength / offset) - 1;
      setSecondIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    //슬라이드애니메이션이 exit 되었을때 실행되는함수
    setLeaving((prev) => !prev);
  };
  const toggleDetail = () => {
    //detail 화면을클릭하면 메인화면으로 빠져나오는함수
    history.push("/");
  };
  const secondToggleLeaving = () => {
    //슬라이드애니메이션이 exit 되었을때 실행되는함수
    setSecondLeaving((prev) => !prev);
  };

  /* 스크롤 이벤트 동작 로직 ------------------------------------------------------------------- */
  const [scrollSwitch, setScrollSwitch] = useState(false);
  const scrollChange = () => {
    if (scrollY.get() > 1000) {
      setScrollSwitch(true);
    } else {
      setScrollSwitch(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", scrollChange);
  }, [scrollSwitch]);

  return (
    <Wrapper>
      <ScrollBoxUp
        variants={scrollVariants}
        whileHover="active"
        initial={{ scale: 0.7 }}
        onClick={topMoveHandler}
      >
        <h3>
          <CgArrowUpR/>
        </h3>
      </ScrollBoxUp>
      {document.body.scrollHeight-500>window.innerHeight? <ScrollBoxDown
        variants={scrollVariants}
        whileHover="active"
        initial={{ scale: 0.7 }}
        onClick={BottomMoveHandler}
      >
        <h3>
          <CgArrowDownR/>
        </h3>
      </ScrollBoxDown>:null}
     

      <SelectBox
        onChange={(e) => languageHandler(e.target.value)}
        defaultValue="Korean"
      >
        <option value="Korean">Korean</option>
        <option value="English">English</option>
      </SelectBox>

      {scrollSwitch /* 스크롤 값 조건에 따라 버튼이보인다 */ ? (
        <MoreBox
          onClick={moreToggleBtn}
          variants={scrollVariants}
          whileHover="active"
          initial={{ scale: 0.7 }}
        >
          <h3>MORE</h3>
        </MoreBox>
      ) : null}

      <Banner>
        <AnimatePresence>
          <BannerParent>
            {filterTest?.slice(3, 13).map((el) => (
              <BannerChildren
                key={el.id}
                /* variants={BannerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.7 }} */
              >
                <ImageItem
                  backgroundimage={makeImagePath(el.poster_path || "")}
                />
                <TextItem>
                  <InnerTitle>{el.title}</InnerTitle>
                  <InnerOverview>
                    {el.overview ? el.overview : "한글소개를지원하지않습니다."}
                  </InnerOverview>
                  <InnerButton onClick={() => onClick(el.id)}>
                    예고편
                  </InnerButton>
                </TextItem>
              </BannerChildren>
            ))}
          </BannerParent>
        </AnimatePresence>

        {isLoading ? <Loder>😑Loding...</Loder> : null}
        <Title>{videoValue?.title || data?.results[0].title}</Title>
        <Overview>{videoValue?.overview || data?.results[0].overview}</Overview>
      </Banner>
      <FirstTextWrapper>
        <InfoText>
          <h3>인기작품</h3>
          <NextButton
            onClick={increaseIndex}
            variants={buttonVariants}
            initial="initial"
            animate="active"
          >
            <div onClick={increaseIndex}>Next ✔</div>
          </NextButton>
        </InfoText>
      </FirstTextWrapper>
      <Slider>
        <AnimatePresence onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((object) => (
                <Col
                  onClick={() => onClick(object.id)}
                  variants={colVariants}
                  initial="nomal"
                  whileHover="hover"
                  key={object.id}
                  backgroundimage={makeImagePath(object.poster_path)}
                >
                  <ColShadow>
                    <div>
                      <h3>제목 : {object.title}</h3>
                      <h3>출시일: {object.release_date}</h3>
                      <h3>평점 : {object.vote_average}점</h3>
                    </div>
                  </ColShadow>
                </Col>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>

      <AnimatePresence>
        {currentUrl?.isExact ? (
          <>
            <DetailWrapperFixed onClick={toggleDetail} />
            <DetailInnerAbsolute style={{ top: window.scrollY + 200 }}>
              {videoValue?.videos?.results[0]?.key ? (
                <ReactPlayer
                  url={`https://www.youtube.com/embed/${videoValue?.videos.results[0].key}`}
                  playing={true}
                  loop={true}
                  controls={true}
                  muted
                  width="100%"
                  height="500px"
                />
              ) : (
                <ErrorView>
                  <h4>한글지원영상이없습니다.ㅠ</h4>
                </ErrorView>
              )}

              {videoValue && (
                <>
                  <DetailOverview>
                    <div>{"영화제목 : " + videoValue.title}</div>
                    {videoValue.overview}
                  </DetailOverview>
                  <DetailReleaseDate>
                    {"영화개봉일 : " + videoValue.release_date}
                  </DetailReleaseDate>
                  <DetailGrade>
                    {"영화평점 : " + videoValue.vote_average == "0"
                      ? videoValue.vote_average
                      : "아직평점이없습니다."}
                  </DetailGrade>
                </>
              )}
            </DetailInnerAbsolute>
          </>
        ) : null}
      </AnimatePresence>

      <Slider>
        <SecondTextWrapper>
          <InfoText>
            <h3>개봉예정작품</h3>
            <NextButton
              onClick={secondincreaseIndex}
              variants={buttonVariants}
              initial="initial"
              animate="active"
            >
              <div>Next ✔</div>
            </NextButton>
          </InfoText>
        </SecondTextWrapper>
        <AnimatePresence onExitComplete={secondToggleLeaving}>
          <SecondSlide
            variants={secondRowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 1 }}
            key={secondIndex}
          >
            {secondData?.results
              .slice(offset * secondIndex, offset * secondIndex + offset)
              .map((object) => (
                <Col
                  onClick={() => onClick(object.id)}
                  variants={colVariants}
                  initial="nomal"
                  whileHover="hover"
                  key={object.id}
                  backgroundimage={makeImagePath(object.poster_path)}
                >
                  <ColShadow>
                    <div>
                      <h3>제목 : {object.title}</h3>
                      <h3>출시일: {object.release_date}</h3>
                      <h3>평점 : {object.vote_average}점</h3>
                    </div>
                  </ColShadow>
                </Col>
              ))}
          </SecondSlide>
        </AnimatePresence>
      </Slider>

      <MovieList>
        <AnimatePresence>
          <ListMoreBtn>
            <ListText onClick={moreToggleBtn}>
              영화더보기
              <div>
                <MdAddCircle />
              </div>
            </ListText>

            <FormWrapper onSubmit={handleSubmit(onValid)}>
              {/* <ListSearch
                {...register("keyword")}
                placeholder="Movies Search Here"
                onChange={(e) => {
                  e.preventDefault();
                  setSearchKeyWord(e.target.value);
                }}
              /> */}
              <SearchBox
                {...register("keyword")}
                placeholder="Movies Search Here"
                initial={{ scaleX: 0 }}
                animate={inputAnimation}
                transition={{ type: "sping" }}
                onChange={(e) => {
                  e.preventDefault();
                  setSearchKeyWord(e.target.value);
                }}
              />
              <Svg
                onClick={toggleHandle}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  initial={{ pathLength: 0, fill: "rgba(255,255,255,0)" }}
                  animate={{ pathLength: 1, fill: "#886288" }}
                  transition={{
                    default: { duration: 3 },
                    fill: { duration: 0.5, delay: 3 },
                  }}
                  fillRule="evenodd"
                  stroke="white"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></motion.path>
              </Svg>
            </FormWrapper>
          </ListMoreBtn>
        </AnimatePresence>
        <AnimatePresence onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 1 }}
          >
            {btnSwitch
              ? filterTest
                  ?.filter((el) => {
                    if (searchKeyWord) {
                      return el.title
                        .toLowerCase()
                        .includes(searchKeyWord.toLowerCase());
                    } else {
                      return el;
                    }
                  })
                  .map((object) => (
                    <Col
                      onClick={() => onClick(object.id)}
                      variants={colVariants}
                      initial="nomal"
                      whileHover="hover"
                      key={object.id}
                      backgroundimage={makeImagePath(
                        object.poster_path,
                        "w500"
                      )}
                    >
                      <ColShadow>
                        <div>
                          <h3>제목 : {object.title}</h3>
                          <h3>출시일: {object.release_date}</h3>
                          <h3>평점 : {object.vote_average}점</h3>
                        </div>
                      </ColShadow>
                    </Col>
                  ))
              : null}
            {/* <div ref={lastCardRef} /> */}
          </Row>
        </AnimatePresence>
      </MovieList>
    </Wrapper>
  );
}

export default React.memo(Movie);
