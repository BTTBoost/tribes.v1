import styled from "@emotion/styled";
import { Provider } from "@self.id/framework";
import Profile from "../../modules/profile";
import closeIcon from "@self.id/multiauth/assets/icon-close.svg";
import selectedIcon from "@self.id/multiauth/assets/icon-selected.svg";
import ethereumLogo from "@self.id/multiauth/assets/ethereum.png";
import metaMaskLogo from "@self.id/multiauth/assets/metamask.png";
import walletConnectLogo from "@self.id/multiauth/assets/walletconnect.png";

type Props = {};

const ProfileTemplate = (props: Props) => {
  return (
    <Container>
      <Provider
        client={{ ceramic: "testnet-clay" }}
        auth={{
          modal: { closeIcon: closeIcon.src, selectedIcon: selectedIcon.src },
          networks: [
            {
              key: "ethereum",
              logo: ethereumLogo.src,
              connectors: [
                { key: "injected", logo: metaMaskLogo.src },
                { key: "walletConnect", logo: walletConnectLogo.src },
              ],
            },
          ],
        }}
      >
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
