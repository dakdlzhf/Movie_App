import { useQuery } from "react-query";
import styled from "styled-components";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import {
  API_KEY,
  BASE_PATH,
  getPopularMovieFetch,
  IGetApi,
  IGetListApi,
  IVideo,
} from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import ReactPlayer from "react-player";
import { useForm } from "react-hook-form";
import _ from "lodash";

const Wrapper = styled.div`
  background-color: #e1b12c;
  height: 150vh;
`;
const Banner = styled.div<{ backgroundimage: string }>`
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.backgroundimage});
  background-size: cover;
  padding: 40px;
`;
const Loder = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.div`
  width: 50%;
  font-size: 50px;
  color: yellow;
  font-family: "Black Han Sans", sans-serif;
  font-weight: bold;
`;
const Overview = styled.div`
  width: 30%;
  font-size: 15px;
  color: white;
  font-family: "Black Han Sans", sans-serif;
`;
const Slider = styled.div`
  position: relative;
`;
const MovieList = styled.div`
  position: relative;
  width: 100%;
  top: 670px;
`;
const ListMoreBtn = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center
  margin-bottom: 10px;
  text-align: center;
  font-family: "Black Han Sans", sans-serif;
  font-weight: bold;
  width: 100%;
  height: 45px;
  border-radius: 5px;
  font-size: 30px;
  background-color: rgb(25, 42, 86);
`;
const ListText = styled(motion.p)`
  width: 150px;
  height: 45px;
  margin-left: 45%;
  background-color: #e1b12c;
  border: 1px solid;
  cursor: pointer;
`;

const ListSearch = styled(motion.input)`
  z-index: 200;
  margin-right: 30px;
  width: 300px;
  height: 45px;
  border-radius: 20px;
  font-size: 30px;
  padding: 10px;
`;
const MovieText = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 30px;
  color: white;
  margin: 10px 30px;
  font-family: "Black Han Sans", sans-serif;
  font-weight: bold;
`;
const SliderButton = styled(motion.div)`
  width: 100px;
  height: 30px;
  border-radius: 20px;
  font-size: 20px;
  cursor: pointer;
  background-color: rgb(25, 42, 86);
  margin-left: 30px;
  text-align: center;
`;

const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 5px;
`;
const Col = styled(motion.div)<{ backgroundimage: string }>`
  height: 300px;
  background-position: center center;
  background-size: cover;
  background-image: url(${(props) => props.backgroundimage});
  background-color: blue;
  border-radius: 20px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const SecondSlide = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 5px;
  top: 350px;
`;
const SecondTextWrapper = styled.div`
  position: absolute;
  top: 300px;
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
  background-color: #3c40c6;
  text-align: center;
  padding: 20px;
  font-family: "Black Han Sans", sans-serif;
  font-size: 20px;
  div {
    margin: 10px;
    font-size: 1rem;
    font-family: "Black Han Sans", sans-serif;
    color: yellow;
  }
`;
const DetailReleaseDate = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #0fbcf9;
  text-align: center;
`;
const DetailGrade = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #ff3f34;
  text-align: center;
`;
//비디오 예고편이 없는 아이템 에러처리 이미지
const ErrorView = styled.div`
  width: 100%;
  height: 500px;
  padding: 50px;
  color: white;
  font-size: 40px;
  text-align: center;
  background-image: url("https://www.wallpapertip.com/wmimgs/99-996631_alone-sad-cardboard-box.jpg");
  background-position: center, center;
  background-size: cover;
`;
// 검색 박스
const SearchBox = styled(motion.input)`
  position: fixed;
  z-index: 200;
  right: 30px;
  bottom: 150px;
  transform-origin: center right;
  width: 300px;
  height: 50px;
  border-radius: 20px;
  font-size: 30px;
  padding: 10px;
`;
const FormWrapper = styled.form``;

// 스크롤 박스 Up,Down
const ScrollBoxUp = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url("https://image.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148901163.jpg");
  background-size: cover;
  color: white;
  z-index: 200;
  cursor: pointer;
  text-align: center;
  line-height: 100px;
  h3 {
    font-size: 4rem;
  }
`;
const ScrollBoxDown = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 150px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEy1zo32-IA-jqIp-O25fxSyzarItuvzJ3eQ&usqp=CAU");
  color: white;
  background-size: contain;
  z-index: 200;
  text-align: center;
  line-height: 100px;
  h3 {
    font-size: 4rem;
  }
`;
//더보기 박스
const MoreBox = styled(motion.div)`
  z-index: 200;
  position: fixed;
  bottom: 20px;
  right: 260px;
  width: 150px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 20px;
  background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEy1zo32-IA-jqIp-O25fxSyzarItuvzJ3eQ&usqp=CAU");
  color: white;
  background-size: contain;
  cursor: pointer;
  h3 {
    font-size: 2.5rem;
  }
`;
//Variants
const searchVariants = {
  initial: {
    scaleX: 0,
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
const movieMoreBtnVaraints = {
  active: {
    color: "#f4f809",
    transition: {
      type: "spring",
      duration: 1,
    },
  },
};

const buttonVariants = {
  initial: {
    opacity: 1,
  },
  active: {
    opacity: [0, 1, 0],
    transition: {
      type: "tween",
      repeat: Infinity,
      duration: 2,
    },
  },
};
const colVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
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
        `https://api.themoviedb.org/3/movie/${objectId}?api_key=f354ee7cde587f576652e7979db2f24a&append_to_response=videos,images`
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
  /* const detailMath =
  currentUrl?.params.id &&
  data?.results.find((movie) => movie.id === +currentUrl.params.id); */
  /* List api 요청 -------------------------------------------------------------------------------*/
  let testArray: IGetListApi[] = [];
  const [test, setTest] = useState<IGetListApi[]>();
  const [btnSwitch, setBtnSwitch] = useState(false);
  /* Count 증가 함수  -----------------------------------------------------------------------------*/
  const moreIncrease = () => {
    setMoreCount((prev) => prev + 2);
    setIsLoading0(false);
  };

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
  /* const clickedMovie =
      bigMovieMatch?.params.movieId &&
      filterTest?.find((movie) => movie.id === +bigMovieMatch.params.movieId); */

  /*select 를이용 언어 변경 로직 */
  const [language, setLanguage] = useState("");
  const languageHandler = (e: string) => {
    if (e === "한국어") {
      setLanguage("ko-KR");
    } else {
      setLanguage("en-US");
    }
  };

  useEffect(() => {
    /* MORE 클릭시 count 증가되면서 데이터 가져오는로직 -------------------------------------------------*/
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
  /* 두번째슬라이드 데이터 요청 ---------------------------------------------------------------------*/
  useEffect(() => {
    const getTopMovieFetch = () => {
      return fetch(
        `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&append_to_response=videos,images`
      ).then((res) => res.json());
    };
    getTopMovieFetch().then((res) => {
      setSecondData(res);
    });
  }, []);

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

  // 스크롤 이벤트가 발생시, throttle 처리

  /* const [onoff,SetOnOff]= useState(false);
      window.addEventListener("scroll",()=>{
        if(window.innerHeight+window.scrollY >= document.body.offsetHeight-500){
          
          SetOnOff(true);
        }
        if(onoff){
          
            setTimeout(()=>{
              moreIncrease();
              SetOnOff(false)
            },1000)
          
        }
      }) */
  /* const lastCardRef = useRef(null); */
  /* const infiniteScroll =useCallback(()=>{

    if(window.innerHeight+window.scrollY >= document.body.offsetHeight-500){
      if(isLoading0){
        moreIncrease()
      }
    }
  },[isLoading0])
  window.addEventListener('scroll',()=>{
    
      infiniteScroll()
    
  },true) */
  return (
    <Wrapper>
      <ScrollBoxUp
        variants={scrollVariants}
        whileHover="active"
        initial={{ scale: 0.7 }}
        onClick={topMoveHandler}
      >
        <h3>
          <AiOutlineArrowUp />
        </h3>
      </ScrollBoxUp>
      <ScrollBoxDown
        variants={scrollVariants}
        whileHover="active"
        initial={{ scale: 0.7 }}
        onClick={BottomMoveHandler}
      >
        <h3>
          <AiOutlineArrowDown />
        </h3>
      </ScrollBoxDown>
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

      <Banner
        backgroundimage={makeImagePath(
          videoValue?.backdrop_path || data?.results[0].poster_path || ""
        )}
      >
        {isLoading ? <Loder>😑Loding...</Loder> : null}
        <Title>{videoValue?.title || data?.results[0].title}</Title>
        <Overview>{videoValue?.overview || data?.results[0].overview}</Overview>
      </Banner>
      <MovieText>
        <h3>인기작품</h3>
        <SliderButton
          onClick={increaseIndex}
          variants={buttonVariants}
          initial="initial"
          animate="active"
        >
          <p>Next ✔</p>
        </SliderButton>
      </MovieText>
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
                  backgroundimage={makeImagePath(object.poster_path, "w500")}
                ></Col>
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
                  /* muted */
                  width="100%"
                  height="500px"
                />
              ) : (
                <ErrorView>
                  <h3>비공개처리되었습니다..😭</h3>
                </ErrorView>
              )}

              {videoValue && (
                <>
                  <DetailOverview>
                    <div>{"영화제목 : " + videoValue.title}</div>
                    {videoValue?.overview}
                  </DetailOverview>
                  <DetailReleaseDate>
                    {"영화개봉일 : " + videoValue.release_date}
                  </DetailReleaseDate>
                  <DetailGrade>
                    {"영화평점 : " + videoValue.vote_average}
                  </DetailGrade>
                </>
              )}
            </DetailInnerAbsolute>
          </>
        ) : null}
      </AnimatePresence>

      <Slider>
        <SecondTextWrapper>
          <MovieText>
            <h3>개봉예정작품</h3>
            <SliderButton
              onClick={secondincreaseIndex}
              variants={buttonVariants}
              initial="initial"
              animate="active"
            >
              <p>Next ✔</p>
            </SliderButton>
          </MovieText>
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
                  backgroundimage={makeImagePath(object.poster_path, "w500")}
                ></Col>
              ))}
          </SecondSlide>
        </AnimatePresence>
      </Slider>

      <MovieList>
        <AnimatePresence>
          <ListMoreBtn>
            <ListText
              variants={movieMoreBtnVaraints}
              whileHover="active"
              onClick={moreToggleBtn}
            >
              MORE
            </ListText>
            <select
              defaultValue="영어"
              onChange={(e) => languageHandler(e.target.value)}
            >
              <option value="한국어">한국어</option>
              <option value="영어">영어</option>
            </select>
            <FormWrapper onSubmit={handleSubmit(onValid)}>
              {scrollSwitch ? (
                <SearchBox
                  {...register("keyword")}
                  layoutId="search"
                  variants={searchVariants}
                  initial="initial"
                  animate={{ scaleX: 1 }}
                  placeholder="Movies Search Here"
                  onChange={(e) => setSearchKeyWord(e.target.value)}
                />
              ) : (
                <ListSearch
                  {...register("keyword")}
                  layoutId="search"
                  placeholder="Movies Search Here"
                  onChange={(e) => setSearchKeyWord(e.target.value)}
                />
              )}
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
                    ></Col>
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
