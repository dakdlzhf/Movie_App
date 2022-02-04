import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

//styled-components
const HeaderWrapper = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  position: fixed;
  top: 0;
  font-size: 20px;
  color: white;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 20px 60px;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;
  width: 100%;
  padding: 20px;
`;
const Item = styled(motion.div)`
  margin-left: 20px;
  width: 100px;
  text-align: center;
  position: relative;
  font-size:23px;
  font-weight:bold;
`;
const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 120px;
  height: 70px;
  fill: red;
  path {
    stroke-width: 10px;
    stroke: yellow;
  }
`;
const Circle = styled(motion.span)`
  width: 100px;
  height: 10px;
  border-radius: 20px;
  background-color: gold;
  position: absolute;
  bottom: -15px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
const Search = styled(motion.form)`
  display: flex;
  align-items: center;
  color: yellow;
  svg {
    height: 40px;
    cursor: pointer;
  }
`;
const Input = styled(motion.input)`
  transform-origin: center right;
  padding: 20px;
  background-color: white;
  height:50px;
  width:250px;
  border-radius:20px;
  font-size:20px;
`;

//Variants
const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

//interface
interface IForm {
  search: string;
}

function Header() {
  const history = useHistory();
  const homeMath = useRouteMatch("/");
  const tvMath = useRouteMatch("/tv");
  const inputAnimation = useAnimation();
  const [searchClick, setSearchClick] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = (data: IForm) => {
    setValue("search", "");
    /* history.push(`/search?keword${data.search}`); */
  };
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
  return (
    <HeaderWrapper>
      <Col>
        <Logo
          variants={logoVariants}
          whileHover="active"
          initial="normal"
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Link to="/">
          <Item>
            Movie{homeMath?.isExact ? <Circle layoutId="circle" /> : null}
          </Item>
        </Link>
        <Link to="/tv">
          <Item>Tv{tvMath?.isExact ? <Circle layoutId="circle" /> : null}</Item>
        </Link>
      </Col>

      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("search", { required: true, minLength: 2 })}
            type="text"
            placeholder="Search Here"
            transition={{ type: "tween" }}
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
          />
          <motion.svg
            onClick={toggleHandle}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
        </Search>
      </Col>
    </HeaderWrapper>
  );
}
export default Header;