import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieFetch, IGetApi } from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { relative } from "path/posix";

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

const Row = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
`;

const Col = styled(motion.div)<{ backgroundimage: string }>`
  height: 300px;
  background-position: center center;
  background-size: cover;
  background-image: url(${(props) => props.backgroundimage});
  background-color: blue;
`;
//Variants

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

function Movie() {
  const { data, isLoading } = useQuery<IGetApi>("api", getMovieFetch);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const offset = 6;
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const indexLength = data.results.length-1
      const maxIndex = Math.floor(indexLength / offset)-1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const rowVariants = {
    hidden: {
      x: window.outerWidth + 10,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -window.outerWidth + 10,
    },
  };
  return (
    <>
      <Banner
        onClick={increaseIndex}
        backgroundimage={makeImagePath(data?.results[17].poster_path || "")}
      >
        {isLoading ? <Loder>😑Loding...</Loder> : null}
        <Title>{data?.results[17].title}</Title>
        <Overview>{data?.results[17].overview}</Overview>
      </Banner>
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
                  key={object.id}
                  backgroundimage={makeImagePath(object.poster_path, "w500")}
                ></Col>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
    </>
  );
}

export default React.memo(Movie);
