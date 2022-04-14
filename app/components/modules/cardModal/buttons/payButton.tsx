import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useState, useEffect } from "react";
import { Task } from "../../../../types";
import {
  Box,
  IconButton,
  InputBase,
  Popover,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListSubheader,
} from "@mui/material";
import { PopoverContainer } from "../styles";
import PaidIcon from "@mui/icons-material/Paid";
import SwitchAccessShortcutIcon from "@mui/icons-material/SwitchAccessShortcut";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import VideoStableIcon from "@mui/icons-material/VideoStable";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArchiveIcon from "@mui/icons-material/Archive";
import { useSpace } from "../../../../../pages/tribe/[id]/space/[bid]";
import { approve } from "../../../../adapters/contract";
import { useMoralis } from "react-moralis";
import { useMoralisFunction } from "../../../../hooks/useMoralisFunction";
import { distributeEther, batchPayTokens } from "../../../../adapters/contract";
import { notify } from "../../settingsTab";
import { useGlobal } from "../../../../context/globalContext";

type Props = {
  task: Task;
  setTask: (task: Task) => void;
  handleClose: () => void;
};

function doShowPayButton(user: any, task: Task) {
  console.log(task.token?.address);
  if (user?.get("distributorApproved")) {
    console.log(task.token?.address === "0x0");
    return (
      task.token?.address === "0x0" ||
      (task.chain?.chainId in user?.get("distributorApproved") &&
        user
          ?.get("distributorApproved")
          [task.chain?.chainId].includes(task.token?.address))
    );
  } else {
    console.log(task.token?.address === "0x0");
    return task.token?.address === "0x0";
  }
}

const PayButton = ({ task, setTask, handleClose }: Props) => {
  const { space, setSpace } = useSpace();
  const { user } = useMoralis();
  const [showPayButton, setShowPayButton] = useState(
    doShowPayButton(user, task)
  );
  const { state } = useGlobal();
  const { registry } = state;
  const { runMoralisFunction } = useMoralisFunction();

  const handleTaskStatusUpdate = (tx: string) => {
    runMoralisFunction("updateCard", {
      updates: {
        status: 300,
        tx: tx,
        taskId: task.taskId,
      },
    })
      .then((res) => {
        console.log(res);
        setSpace(res.space);
        setTask(res.task);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const handlePaymentError = (err: any) => {
    console.log(err);
    if (window.ethereum.networkVersion !== task.chain.chainId)
      notify(`Please switch to ${task.chain?.name} network`, "error");
    else {
      notify(err.message, "error");
    }
  };

  useEffect(() => {
    setShowPayButton(doShowPayButton(user, task));
  }, [task]);

  return (
    <>
      {showPayButton && (
        <ListItemButton
          onClick={() => {
            task.token.symbol === registry[task.chain.chainId].nativeCurrency
              ? distributeEther(
                  [space.memberDetails[task.assignee[0]].ethAddress],
                  [task.value],
                  task.taskId,
                  window.ethereum.networkVersion
                )
                  .then((res: any) => {
                    console.log(res);
                    //handleTaskStatusUpdate(as);
                    handleClose();
                  })
                  .catch((err: any) => {
                    handlePaymentError(err);
                  })
              : batchPayTokens(
                  [task.token.address as string],
                  [space.memberDetails[task.assignee[0]].ethAddress],
                  [task.value],
                  task.taskId,
                  window.ethereum.networkVersion
                )
                  .then((res: any) => {
                    //handleTaskStatusUpdate([task.taskId]);
                    handleClose();
                  })
                  .catch((err: any) => {
                    handlePaymentError(err);
                  });
          }}
        >
          <PaidIcon sx={{ width: "2rem", mr: 2 }} />
          <ListItemText primary="Pay" />
        </ListItemButton>
      )}
      {!showPayButton && (
        <ListItemButton
          onClick={() => {
            if (task.chain?.chainId !== window.ethereum.networkVersion) {
              handlePaymentError({});
            } else {
              approve(task.chain.chainId, task.token.address as string)
                .then((res: any) => {
                  setShowPayButton(true);
                  if (user) {
                    if (
                      user?.get("distributorApproved") &&
                      task.chain.chainId in user?.get("distributorApproved")
                    ) {
                      user
                        ?.get("distributorApproved")
                        [task.chain.chainId].push(task.token.address as string);
                    } else if (user?.get("distributorApproved")) {
                      user?.set("distributorApproved", {
                        ...user?.get("distributorApproved"),
                        [task.chain.chainId]: [task.token.address as string],
                      });
                    } else {
                      user?.set("distributorApproved", {
                        [task.chain.chainId]: [task.token.address as string],
                      });
                    }
                    user.save();
                  }
                })
                .catch((err: any) => {
                  handlePaymentError(err);
                });
            }
          }}
        >
          <PaidIcon sx={{ width: "2rem", mr: 2 }} />
          <ListItemText primary="Approve Token" />
        </ListItemButton>
      )}
    </>
  );
};

export default PayButton;
