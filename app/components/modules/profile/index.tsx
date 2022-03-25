import styled from "@emotion/styled";
import {
  AvatarPlaceholder,
  useConnection,
  usePublicRecord,
  useViewerRecord,
} from "@self.id/framework";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LinkIcon from "@mui/icons-material/Link";
import { Box, Typography } from "@mui/material";
import { PrimaryButton } from "../../elements/styledComponents";
import EditProfileModal from "../editProfile";
import { GitHub } from "@mui/icons-material";
// import { Integration } from "lit-ceramic-sdk";
import dynamic from "next/dynamic";

// const Integration = dynamic(
//   () =>
//     import("lit-ceramic-sdk").then((mod) => {
//       console.log(mod.Integration);
//       console.log(mod);
//     }),
//   {
//     ssr: false,
//   }
// );

type Props = {};

const Profile = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [connection, connect] = useConnection();
  const publicRecord = usePublicRecord("basicProfile", id);
  const publicSocialRecord = usePublicRecord("alsoKnownAs", id);
  const [litClient, setLitClient] = useState({} as any);
  const [decryptedLocation, setDecryptedLocation] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const InitializeLitProtocol = async () => {
    const Integration = (await import("lit-ceramic-sdk")).Integration;
    let litCeramicIntegration = new Integration(
      "https://ceramic-clay.3boxlabs.com",
      "polygon"
    );
    litCeramicIntegration.startLitClient(window);
    setLitClient(litCeramicIntegration);
  };

  useEffect(() => {
    InitializeLitProtocol();
  }, []);

  const decrypt = () => {
    litClient
      .readAndDecrypt(publicRecord.content?.homeLocation)
      .then((value: string) => {
        console.log(value);
        setDecryptedLocation(value);
      });
  };

  return (
    <Container>
      <EditProfileModal
        isOpen={isOpen}
        handleClose={handleClose}
        litClient={litClient}
      />
      <Banner
        src={
          publicRecord.content?.background?.original
            ? `https://ipfs.moralis.io:2053/ipfs/${publicRecord.content?.background?.original.src.substring(
                7
              )}`
            : "https://ipfs.moralis.io:2053/ipfs/QmYBYKJmPzzBBtBrP7VWPi4va9NsvcBmAV6N8VBPAt6pk6"
        }
      />
      <Heading>
        <AvatarContainer>
          {publicRecord.content?.image?.original.src ? (
            <Avatar
              src={`https://ipfs.moralis.io:2053/ipfs/${publicRecord.content?.image?.original.src.substring(
                7
              )}`}
            />
          ) : (
            <AvatarPlaceholder did={""} size={146} />
          )}
        </AvatarContainer>
        <InfoContainer>
          <Box sx={{ display: "flex" }}>
            <Username>{publicRecord.content?.name}</Username>
            <LinkIcon color="disabled" />
            <URL>{publicRecord.content?.url}</URL>
          </Box>
          <DID>{id}</DID>
          {connection.status === "connected" ? (
            <PrimaryButton
              variant="contained"
              sx={{ borderRadius: 1, width: "50%" }}
              disabled={connection.selfID.id !== id}
              onClick={() => setIsOpen(true)}
            >
              {"Edit Profile"}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              variant="contained"
              sx={{ borderRadius: 1, width: "50%" }}
              loading={connection.status === "connecting"}
              onClick={() => connect()}
            >
              {"Connect to Cermaic"}
            </PrimaryButton>
          )}
        </InfoContainer>
      </Heading>
      <Body>
        <Description>{publicRecord.content?.description}</Description>
        <Typography variant="h6" color="text.secondary">
          Verified Socials
        </Typography>
        {publicSocialRecord.content?.accounts?.map((account, index) => (
          <PrimaryButton
            fullWidth
            key={index}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 2, my: 2 }}
            onClick={() =>
              window.open(
                `${account.protocol}://${account.host}/${account.id}`,
                "_blank"
              )
            }
          >
            {account.host === "github.com" && <GitHub />}
            <Typography sx={{ width: "100%", textAlign: "left", mx: 8, p: 2 }}>
              {account.id}
            </Typography>
          </PrimaryButton>
        ))}
        <Typography color="text.primary">
          {decryptedLocation || publicRecord.content?.homeLocation}
        </Typography>
        <PrimaryButton
          variant="outlined"
          sx={{ width: "60%", m: 2, borderRadius: 1 }}
          onClick={decrypt}
          color="inherit"
        >
          Decrypt
        </PrimaryButton>
      </Body>
    </Container>
  );
};
export default Profile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const URL = styled.a`
  color: #99ccff;
  margin: 0 0.5rem;
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0.5rem 8rem;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 8rem;
`;

const Banner = styled.div<{ src: string }>`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  position: relative;
  min-height: 16rem;
  background-size: cover;
  background-image: url(${(props) => props.src});
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
`;
const Username = styled.div`
  font-weight: bold;
  color: #eaeaea;
  font-size: 1.5rem;
  margin-right: 4rem;
`;

const Description = styled.div`
  color: #cacaca;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

const DID = styled.div`
  color: #5a6972;
  font-size: 0.8rem;
`;

const AvatarContainer = styled.div`
  width: 146px;
  height: 146px;
  border: 3px solid white;
  border-radius: 78px;
  margin-top: -4rem;
  z-index: 1;
`;

const Avatar = styled.img`
  width: 146px;
  height: 146px;
  border-radius: 50%;
  object-fit: cover;
  float: left;
`;
