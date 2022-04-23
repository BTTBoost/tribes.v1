import ArchiveIcon from '@mui/icons-material/Archive';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VideoStableIcon from '@mui/icons-material/VideoStable';
import ViewCompactAltIcon from '@mui/icons-material/ViewCompactAlt';
import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
} from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import React, { useState } from 'react';
import { useSpace } from '../../../../../pages/tribe/[id]/space/[bid]';
import useMoralisFunction from '../../../../hooks/useMoralisFunction';
import { Task } from '../../../../types';
import PayButton from '../buttons/payButton';
import useCardDynamism from '../../../../hooks/useCardDynamism';
import useCardStatus from '../../../../hooks/useCardStatus';
import { notify } from '../../settingsTab';
import useCard from '../../../../hooks/useCard';

type Props = {
  task: Task;
  setTask: (task: Task) => void;
};

function OptionsPopover({ task, setTask }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const { viewableComponents } = useCardDynamism(task);
  const { runMoralisFunction } = useMoralisFunction();
  const { space, setSpace } = useSpace();
  const { updateStatus } = useCard(setTask, task);
  const { statusToCode } = useCardStatus();

  const handleClick = () => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const duplicateCard = () => {
    handleClose();
    runMoralisFunction('addTask', {
      boardId: task.boardId,
      columnId: task.columnId,
      title: task.title,
      value: task.value,
      token: task.token,
      chain: task.chain,
      type: task.type,
      tags: task.tags,
      description: task.description,
      assignee: task.assignee,
      deadline: task.deadline,
    })
      .then((res) => {
        setSpace(res.space);
        notify('Card has been duplicated', 'success');
      })
      .catch((err) => {
        console.log(err);
        notify(`${err.message}`, 'error');
      });
  };

  return (
    <>
      <IconButton sx={{ m: 0, px: 2 }} onClick={handleClick()}>
        <MoreHorizIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            maxHeight: 200,
            overflow: 'auto',
            bgcolor: 'background.paper',
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton
            onClick={() => {
              const link = `${window.location.href}?taskId=${task.taskId}`;
              navigator.clipboard.writeText(link);
              notify('Task Link copied');
            }}
          >
            <IosShareIcon sx={{ width: '2rem', mr: 2 }} />
            <ListItemText primary="Share" />
          </ListItemButton>
          <PayButton task={task} setTask={setTask} handleClose={handleClose} />

          {viewableComponents.proposalGate && (
            <ListItemButton>
              <VideoStableIcon sx={{ width: '2rem', mr: 2 }} />
              <ListItemText primary="Gate Proposals" />
            </ListItemButton>
          )}
          {viewableComponents.submissionGate && (
            <ListItemButton onClick={handleClick}>
              <ViewCompactAltIcon sx={{ width: '2rem', mr: 2 }} />
              <ListItemText primary="Gate Submissions" />
            </ListItemButton>
          )}

          {viewableComponents.duplicate && (
            <ListItemButton onClick={duplicateCard}>
              <ContentCopyIcon sx={{ width: '2rem', mr: 2 }} />
              <ListItemText primary="Duplicate" />
            </ListItemButton>
          )}
          {viewableComponents.archive && (
            <ListItemButton
              onClick={() => {
                updateStatus(statusToCode.archived);
              }}
            >
              <ArchiveIcon sx={{ width: '2rem', mr: 2 }} />
              <ListItemText primary="Archive" />
            </ListItemButton>
          )}
        </List>
      </Popover>
    </>
  );
}

export default OptionsPopover;
