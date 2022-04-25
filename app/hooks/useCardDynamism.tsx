import React, { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import useAccess from './useAccess';
import useCardStatus from './useCardStatus';
import { useCardContext } from '../components/modules/cardModal';

export default function useCardDynamism() {
  const { user } = useMoralis();
  const { task, proposalEditMode } = useCardContext();

  const {
    isSpaceSteward,
    isCardSteward,
    isCardStakeholder,
    isSpaceMember,
    isCardAssignee,
  } = useAccess(task);
  const { isPaid, isUnassigned, hasNoReward } = useCardStatus();
  const [viewableComponents, setViewableComponents] = useState({} as any);
  const [editAbleComponents, setEditableComponents] = useState({} as any);
  const [tabs, setTabs] = useState([] as string[]);
  const [tabIdx, setTabIdx] = useState(0);

  function getPayButtonView() {
    if (!isCardSteward() || isPaid() || isUnassigned() || hasNoReward())
      return 'hide';

    if (user?.get('distributorApproved')) {
      if (
        task.token?.address === '0x0' ||
        (task.chain?.chainId in user.get('distributorApproved') &&
          user
            .get('distributorApproved')
            [task.chain?.chainId].includes(task.token?.address))
      )
        return 'showPay';
      return 'showApprove';
    }
    if (task.token?.address === '0x0') return 'showPay';
    return 'showApprove';
  }
  const getReason = (field: string) => {
    if (isPaid()) {
      return 'Cannot edit, already paid for card';
    }
    switch (field) {
      case 'reward':
      case 'description':
      case 'title':
      case 'reviewer':
      case 'column':
      case 'type':
      case 'label':
        return `Only card reviewer or creator and space steward can edit ${field}`;
      case 'assignee':
        return `Only card assignee, reviewer or creator and space steward can edit ${field}`;
      case 'dueDate':
        return `Only card assignee, reviewer or creator and space steward can edit due date`;
      default:
        return '';
    }
  };

  const isStakeholderAndUnpaid = () => {
    return isCardStakeholder() && !isPaid();
  };

  const isGeneralEditable = () => {
    return isCardSteward() && !isPaid();
  };

  const isAssigneeEditable = () => {
    if (isPaid()) return false;
    if (task?.assignee?.length > 0) {
      return isCardStakeholder();
    }
    return true;
  };

  const isAssigneeViewable = () => {
    if (task?.assignee?.length > 0) {
      return true;
    }
    return isCardSteward();
  };

  const isAssignToMeViewable = () => {
    if (task?.assignee?.length === 0) {
      return task.type === 'Task' && isSpaceMember();
    }
    return false;
  };

  const resolveTabs = () => {
    if (task.type === 'Task') {
      return ['Comments', 'Activity'];
    }
    if (task.type === 'Bounty') {
      // No assignee yet
      if (task.status === 100) {
        if (isCardSteward()) {
          return ['Applicants', 'Activity'];
        }
        if (task.proposals?.length > 0 || proposalEditMode) {
          return ['Application', 'Activity'];
        }
        return ['Activity']; // Only return application tab if there are any
      }
      // Card has been assigned

      if (isCardSteward()) {
        return ['Submissions', 'Activity', 'Applicants'];
      }
      if (isCardAssignee()) {
        return ['Submissions', 'Activity', 'Application'];
      }
      return ['Activity'];
    }
    return [];
  };

  const resolveTabIdx = (
    prevTabs: Array<string>,
    currTabs: Array<string>,
    prevTabIdx: number
  ) => {
    if (currTabs.length === prevTabs.length) {
      return prevTabIdx;
    }
    return 0;
  };

  const isApplyButtonViewable = () => {
    if (task.type === 'Bounty') {
      if (task.access?.reviewer || task.access?.creator) {
        return false;
      }
      return task.status === 100 && task.proposals?.length === 0;
    }
    return false;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIdx(newValue);
  };

  const getViewableComponents = () => {
    return {
      pay: getPayButtonView(),
      proposalGate: false,
      submissionGate: false,
      duplicate: isSpaceSteward(),
      archive: isSpaceSteward(),
      assignee: isAssigneeViewable(),
      reviewer: true,
      assignToMe: isAssignToMeViewable(),
      addComment: isSpaceMember() || isCardStakeholder(),
      optionPopover: isSpaceSteward() || isCardStakeholder(),
      applyButton: isApplyButtonViewable(),
    };
  };

  const getEditableComponents = () => {
    const editable = isGeneralEditable();
    return {
      title: editable,
      description: editable,
      label: editable,
      type: editable,
      dueDate: isStakeholderAndUnpaid(),
      reward: editable,
      reviewer: editable,
      column: isStakeholderAndUnpaid(),
      assignee: isAssigneeEditable(),
    };
  };

  useEffect(() => {
    setViewableComponents(getViewableComponents());
    setEditableComponents(getEditableComponents());

    const newTabs = resolveTabs();
    const newTabIdx = resolveTabIdx(tabs, newTabs, tabIdx);
    setTabs(newTabs);
    setTabIdx(newTabIdx);
  }, [task]);

  return {
    viewableComponents,
    editAbleComponents,
    getReason,
    tabs,
    setTabs,
    handleTabChange,
    tabIdx,
  };
}
