import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Footer from "../modules/footer";
import Navbar from "../modules/navbar";
import Sidebar from "../modules/spaceSidebar";
import { useMoralis } from "react-moralis";
import GlobalContextProvider, {
  initContracts,
  useGlobal,
} from "../../context/globalContext";
interface Props {
  children: React.ReactNode;
}

const OuterDiv = styled.div`
  position: relative;
  width: 100%;
  letter-spacing: 0.025em;
  line-height: 1.5;
  font-size: 1.5rem;
  overflow-x: hidden;
`;

const InnerDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Main = styled.main`
  flex-grow: 1;
`;

const Layout = ({ children }: Props) => {
  const { Moralis } = useMoralis();
  const { dispatch } = useGlobal();

  useEffect(() => {
    initContracts(dispatch);
    //initRegistry(Moralis)
  }, []);
  return (
    <OuterDiv>
      <Main>{children}</Main>
      {/* <Footer /> */}
    </OuterDiv>
  );
};

export default Layout;
