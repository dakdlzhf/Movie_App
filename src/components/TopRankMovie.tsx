import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getTopMovieFetch, IGetApi } from "../api";
import { makeImagePath } from "../utils";

const Slider = styled.div`
  position: relative;
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

function TopRankMovie() {
  const { data, isLoading } = useQuery<IGetApi>("top", getTopMovieFetch);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const offset = 5;
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const indexLength = data.results.length;
      const maxIndex = Math.floor(indexLength / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onClick = (objectId: number) => {
    history.push(`/detail/${objectId}`);
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
    </>
  );
}
export default TopRankMovie;
