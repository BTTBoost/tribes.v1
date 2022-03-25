import styled from "@emotion/styled";
import { Close } from "@mui/icons-material";
import {
  Box,
  Divider,
  Grow,
  IconButton,
  Modal,
  styled as MUIStyled,
  TextField,
  Typography,
} from "@mui/material";
import { useViewerRecord } from "@self.id/framework";
import React, { useEffect, useState } from "react";
import { ModalHeading, PrimaryButton } from "../../elements/styledComponents";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  litClient: any;
};

const EditProfileModal = ({ isOpen, handleClose, litClient }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const record = useViewerRecord("basicProfile");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [locationStreamId, setLocationStreamId] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    console.log(record.content);
    setName(record.content?.name as string);
    setBio(record.content?.description as string);
    setLocation(record.content?.homeLocation as string);
    setUrl(record.content?.url as string);
  }, [isOpen]);

  const onSubmit = () => {
    setIsLoading(true);
    if (record?.set) {
      record
        .set({
          ...record.content,
          name: name,
          description: bio,
          homeLocation: locationStreamId,
          url: url,
        })
        .then((res: any) => {
          console.log(res);
          setIsLoading(false);
          handleClose();
        });
    }
  };

  const encrypt = () => {
    const stringToEncrypt = location;
    const accessControlConditions = [
      {
        contractAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        standardContractType: "ERC20",
        chain: "polygon",
        method: "balanceOf",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: ">=",
          value: "10000000000000",
        },
      },
    ];
    litClient
      .encryptAndWrite(stringToEncrypt, accessControlConditions)
      .then((streamID: string) => {
        console.log(streamID);
        setLocationStreamId(streamID);
      });
  };

  return (
    <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
      <Grow in={isOpen} timeout={500}>
        <ModalContainer>
          <ModalHeading>
            <Typography color="inherit">Edit profile</Typography>
            <Box sx={{ flex: "1 1 auto" }} />
            <IconButton sx={{ m: 0, p: 0.5 }} onClick={handleClose}>
              <Close />
            </IconButton>
          </ModalHeading>
          <ModalContent>
            <Box sx={{ m: 2 }}>
              <Typography color="text.secondary" sx={{ fontSize: 12.5, ml: 3 }}>
                Cover
              </Typography>
              <Banner
                src={`https://ipfs.moralis.io:2053/ipfs/${record.content?.background?.original.src.substring(
                  7
                )}`}
              />
            </Box>
            <TextField
              placeholder="Name"
              label="Name"
              color="secondary"
              sx={{ m: 2 }}
              fullWidth
              value={name}
              onChange={(evt) => setName(evt.target.value)}
            />
            <TextField
              placeholder="Bio"
              color="secondary"
              label="Bio"
              sx={{ m: 2 }}
              fullWidth
              multiline
              value={bio}
              onChange={(evt) => setBio(evt.target.value)}
            />
            <TextField
              placeholder="Location"
              color="secondary"
              label="Location"
              sx={{ m: 2 }}
              fullWidth
              value={location}
              onChange={(evt) => setLocation(evt.target.value)}
            />
            <TextField
              placeholder="URL"
              color="secondary"
              label="URL"
              sx={{ m: 2 }}
              fullWidth
              value={url}
              onChange={(evt) => setUrl(evt.target.value)}
            />
            <PrimaryButton
              variant="outlined"
              sx={{ width: "60%", m: 2, borderRadius: 1 }}
              onClick={onSubmit}
              loading={isLoading}
              color="inherit"
            >
              Save Changes
            </PrimaryButton>
            <PrimaryButton
              variant="outlined"
              sx={{ width: "60%", m: 2, borderRadius: 1 }}
              onClick={encrypt}
              loading={isLoading}
              color="inherit"
            >
              Encrypt
            </PrimaryButton>
          </ModalContent>
        </ModalContainer>
      </Grow>
    </Modal>
  );
};

// @ts-ignore
const ModalContainer = MUIStyled(Box)(({ theme }) => ({
  position: "absolute" as "absolute",
  top: "10%",
  left: "35%",
  transform: "translate(-50%, -50%)",
  width: "30rem",
  border: "2px solid #000",
  backgroundColor: theme.palette.background.default,
  boxShadow: 24,
  overflow: "auto",
  maxHeight: "calc(100% - 128px)",
}));

const ModalContent = MUIStyled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 32,
}));

const Banner = styled.img`
  height: 8rem;
  width: 100%;
  object-fit: cover;
`;

export default EditProfileModal;
