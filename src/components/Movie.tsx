import { useQuery } from "react-query";
import styled from "styled-components";
import {
  API_KEY,
  BASE_PATH,
  getPopularMovieFetch,
  getTopMovieFetch,
  IGetApi,
} from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import TopRankMovie from "./TopRankMovie";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: #e1b12c;
  height: 200vh;
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

function Movie() {
  const { data, isLoading } = useQuery<IGetApi>("api", getPopularMovieFetch);
  const [secondData, setSecondData] = useState<IGetApi>();
  const [index, setIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [secondLeaving, setSecondLeaving] = useState(false);
  const history = useHistory();
  const offset = 5;
  const onClick = (objectId: number) => {
    history.push(`/detail/${objectId}`);
  };
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
  console.log(secondData);
  return (
    <Wrapper>
      <Banner
        backgroundimage={makeImagePath(data?.results[2].poster_path||"" )}
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
                  key={object.id}
                  backgroundimage={makeImagePath(object.poster_path, "w500")}
                ></Col>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>


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
