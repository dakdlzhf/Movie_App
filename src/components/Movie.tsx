import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieFetch, IGetApi } from "../api";
import { makeImagePath } from "../utils";
import { motion } from "framer-motion";

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
const BoxListRow = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  background-color: black;
  gap: 10px;
`;

const BoxItemCol = styled(motion.div)<{ backgroundimage: string }>`
  width: 100%;
  height: 100%;
  background-position: center center;
  background-size: cover;
  background-image: url(${(props) => props.backgroundimage});
  background-color: blue;
`;

function Movie() {
  const { data, isLoading } = useQuery<IGetApi>("api", getMovieFetch);
  console.log(data);
  return (
    <>
      <Banner
        backgroundimage={makeImagePath(data?.results[2].poster_path || "")}
      >
        {isLoading ? <Loder>😑Loding...</Loder> : null}
        <Title>{data?.results[2].title}</Title>
        <Overview>{data?.results[2].overview}</Overview>
      </Banner>
      <Slider>
        <BoxListRow>
          {data?.results.map((object, index) => (
            <BoxItemCol
              key={object.id}
              backgroundimage={makeImagePath(
                data?.results[index].poster_path || ""
              )}
            ></BoxItemCol>
          ))}
        </BoxListRow>
      </Slider>
    </>
  );
}
export default Movie;
