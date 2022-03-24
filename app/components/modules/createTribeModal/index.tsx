import {
  Box,
  Grow,
  IconButton,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import CloseIcon from "@mui/icons-material/Close";
import { ModalHeading, PrimaryButton } from "../../elements/styledComponents";
import {
  createTribe,
  createDecentralizedTribe,
} from "../../../adapters/moralis";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { SidebarButton } from "../exploreSidebar";
import { notify } from "../settingsTab";
import { createProfile, getProfileIdByHandle } from "../../../adapters/lens";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { tryAuthenticate } from "../auth";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { createNftDidUrl } from "nft-did-resolver";

type Props = {};

const CreateTribeModal = (props: Props) => {
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [multiSig, setMultiSig] = useState("");
  const [lensId, setLensId] = useState(-1);
  const [streamId, setStreamId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showButton, setShowButton] = useState(0);
  const router = useRouter();
  const { palette } = useTheme();

  const { Moralis, isAuthenticated, authenticate, user } = useMoralis();
  const ceramic = new CeramicClient();

  const onSubmit = () => {
    setIsLoading(true);
    createTribe(Moralis, name)
      .then((res: any) => {
        setIsLoading(false);
        handleClose();
        router.push({
          pathname: `/tribe/${res.get("teamId")}`,
        });
      })
      .catch((err: any) => {
        setIsLoading(false);
        handleClose();
        notify(err.message, "error");
      });
  };

  return (
    <>
      <Toaster />
      <Tooltip title="Create Tribe" placement="right" arrow sx={{ m: 0, p: 0 }}>
        <SidebarButton
          palette={palette}
          selected={false}
          onClick={() => {
            if (!isAuthenticated) {
              authenticate();
            } else {
              handleOpen();
            }
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 30, color: palette.divider }} />
        </SidebarButton>
      </Tooltip>
      {/* <SidebarButton
        sx={{ mt: 2 }}
        color="inherit"
        onClick={() => {
          if (!isAuthenticated) {
            authenticate();
          } else {
            handleOpen();
          }
        }}
      >
        <AddIcon />
        <ButtonText>Create Tribe</ButtonText>
      </SidebarButton> */}
      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Grow in={isOpen} timeout={500}>
          <ModalContainer>
            <ModalHeading>
              <Typography color="inherit">Create Tribe</Typography>
              <Box sx={{ flex: "1 1 auto" }} />
              <IconButton sx={{ m: 0, p: 0.5 }} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </ModalHeading>
            <ModalContent>
              <TextField
                placeholder="Tribe Name"
                fullWidth
                value={name}
                onChange={(evt) => setName(evt.target.value)}
              />
              <TextField
                placeholder="Tribe Multi-sig"
                fullWidth
                value={multiSig}
                onChange={(evt) => setMultiSig(evt.target.value)}
              />
              {showButton === 0 && (
                <PrimaryButton
                  variant="outlined"
                  sx={{ width: "60%", mt: 2, borderRadius: 1 }}
                  onClick={() => {
                    setIsLoading(true);
                    console.log(name);
                    console.log(multiSig);

                    createProfile({
                      to: user?.get("ethAddress"),
                      handle: name,
                      imageURI:
                        "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
                      followModule:
                        "0x0000000000000000000000000000000000000000",
                      followModuleData: [],
                      followNFTURI:
                        "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
                    })
                      .then((res: any) => {
                        getProfileIdByHandle(name).then((res: any) => {
                          setLensId(res.toNumber());
                          setShowButton(1);
                          setIsLoading(false);
                        });
                      })
                      .catch((err: any) => {
                        alert(err);
                        setIsLoading(false);
                      });
                  }}
                  loading={isLoading}
                  color="inherit"
                >
                  Generate profile NFT
                </PrimaryButton>
              )}
              {showButton === 1 && (
                <PrimaryButton
                  variant="outlined"
                  sx={{ width: "60%", mt: 2, borderRadius: 1 }}
                  onClick={() => {
                    const didNFT = createNftDidUrl({
                      chainId: "eip155:80001",
                      namespace: "erc721",
                      contract: "0x6CC5F26402C4d6Ab0CB9d139242E2682aA80b751",
                      tokenId: `${lensId}`,
                    });
                    console.log(didNFT);
                    TileDocument.create(
                      ceramic,
                      { name: name },
                      { controllers: [didNFT] }
                    ).then((res: any) => {
                      console.log(res);
                      createDecentralizedTribe(Moralis, name, lensId, res.id)
                        .then((res: any) => {
                          setIsLoading(false);
                          //handleClose();
                        })
                        .catch((err: any) => {
                          setIsLoading(false);
                          //handleClose();
                          notify(err.message, "error");
                        });
                    });
                  }}
                  loading={isLoading}
                  color="inherit"
                >
                  Create your tribe
                </PrimaryButton>
              )}
            </ModalContent>
          </ModalContainer>
        </Grow>
      </Modal>
    </>
  );
};

const ModalContent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 32,
}));

// @ts-ignore
const ModalContainer = styled(Box)(({ theme }) => ({
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

export default CreateTribeModal;
