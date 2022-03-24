import styled from "@emotion/styled";
import { Provider } from "@self.id/framework";
import React from "react";
import Profile from "../../modules/profile";

type Props = {};

const ProfileTemplate = (props: Props) => {
  return (
    <Container>
      <Provider client={{ ceramic: "testnet-clay" }}>
        <Profile />
      </Provider>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000f29;
  width: 100%;
`;

export default ProfileTemplate;
