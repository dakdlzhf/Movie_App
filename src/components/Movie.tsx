import { useQuery } from "react-query";
import styled from "styled-components";
import {
  API_KEY,
  BASE_PATH,
  getPopularMovieFetch,
  getTopMovieFetch,
  getViedoFetch,
  IGetApi,
  IVideo,
} from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import ReactPlayer from "react-player";
import { setTimeout } from "timers/promises";

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
  padding: 60px;
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
  width: 50%;
  font-size: 20px;
  color: white;
  font-family: "Black Han Sans", sans-serif;
`;
const Slider = styled.div`
  position: relative;
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
const DirButton1 = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 80px;
  left: 20px;
  margin: 0 auto;
  font-size: 30px;
  padding-bottom: 8px;
  text-align: center;
`;
const DirButton2 = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 80px;
  right: 20px;
  margin: 0 auto;
  font-size: 30px;
  text-align: center;
  padding-bottom: 8px;
`;
const DetailWrapperFixed = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.5;
  z-index: 100;
`;
const DetailInnerAbsolute = styled(motion.div)`
  position: absolute;
  width: 50%;
  top: 300px;
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

//Variants

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
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

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
  const offset = 5;
  
  const onClick = async (objectId: number) => {
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
  const detailMath =
    currentUrl?.params.id &&
    data?.results.find((movie) => movie.id === +currentUrl.params.id);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const indexLength = data.results.length;
      const maxIndex = Math.floor(indexLength / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const secondincreaseIndex = () => {
    if (secondData) {
      if (secondLeaving) return;
      setSecondLeaving(true);
      const indexLength = secondData.results.length;
      const maxIndex = Math.floor(indexLength / offset) - 1;
      setSecondIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const toggleDetail = () => {
    history.push("/");
  };
  const secondToggleLeaving = () => {
    setSecondLeaving((prev) => !prev);
  };
  const rowVariants = {
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
  useEffect(() => {
    const getTopMovieFetch = () => {
      return fetch(
        `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&append_to_response=videos,images`
      ).then((res) => res.json());
    };
    getTopMovieFetch().then((res) => {
      setSecondData(res);
    });
  }, []);
  return (
    <Wrapper>
      <Banner
        backgroundimage={makeImagePath(data?.results[2].poster_path || "")}
      >
        {isLoading ? <Loder>😑Loding...</Loder> : null}
        <Title>{data?.results[2].title}</Title>
        <Overview>{data?.results[2].overview}</Overview>
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
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
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
            <DetailInnerAbsolute>
              <ReactPlayer
                url={`https://www.youtube.com/embed/${videoValue?.videos.results[0].key}`}
                playing={true}
                loop={true}
                controls={true}
                muted
                width="100%"
                height="500px"
              />
              {detailMath && (
                <>
                  <DetailOverview>
                    <div>{"영화제목 : " + detailMath.title}</div>
                    {detailMath.overview}
                  </DetailOverview>
                  <DetailReleaseDate>
                    {"영화개봉일 : " + detailMath.release_date}
                  </DetailReleaseDate>
                  <DetailGrade>
                    {"영화평점 : " + detailMath.vote_average}
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
            <h3>Best20 명작</h3>
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
        <AnimatePresence initial={false} onExitComplete={secondToggleLeaving}>
          <SecondSlide
            variants={secondRowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
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
    </Wrapper>
  );
}

export default React.memo(Movie);
