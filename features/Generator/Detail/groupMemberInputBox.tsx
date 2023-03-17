import { Button, Flex, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TeamData } from ".";
import { RankCard } from "../../../components/organisms/RankCard";
import { useRanks } from "../../../Hooks/useRanks";
import { RankStateType } from "../../../types/RankCard";
import { ReqTeamGrouping } from "../../../types/request/Team";
import { supabase } from "../../../utils/supabase";

type GroupMemberInputBoxProps = {
  groupId: string | string[] | undefined;
  startLoading: () => void;
  stopLoading: () => void;
  setRespTeamData: (teamData: TeamData) => void;
  setMode: (mode: "input" | "result") => void;
};

const GroupMemberInputBox = (props: GroupMemberInputBoxProps) => {
  const { groupId, startLoading, stopLoading, setRespTeamData, setMode } =
    props;
  const toast = useToast();
  const [rankStateList, setRankStateList] = useState<RankStateType[]>([]);

  const { fetchRankStateList } = useRanks(setRankStateList);

  // rankStateListの初期化
  useEffect(() => {
    try {
      startLoading();
      fetchRankStateList();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  }, []);

  // Inputの追加
  const createNewMember = (rankId: string) => {
    let newUserList: string[] = [];
    const selectedRankState = rankStateList.find((rankState) => {
      return rankState.uuid === rankId;
    });
    if (selectedRankState) {
      newUserList = [...selectedRankState.userList];
    }
    newUserList.push("");
    console.log("newUserList", newUserList);
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.uuid === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };

  // Inputの削除
  const deleteMember = (rankId: string, orderInRank: number) => {
    let newUserList: string[] = [];
    const selectedRankState = rankStateList.find((rankState) => {
      return rankState.uuid === rankId;
    });
    if (selectedRankState) {
      newUserList = [...selectedRankState.userList];
    }
    newUserList.splice(orderInRank, 1);
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.uuid === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };

  // ユーザー名の変更
  const onChangeUserName = (
    rankId: string,
    orderInRank: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUserName = e.target.value;
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.uuid === rankId
          ? {
              ...rankState,
              userList: rankState.userList.map((user, i) =>
                i === orderInRank ? newUserName : user
              ),
            }
          : rankState
      )
    );
  };

  const postTeamMembers = () => {
    if (typeof groupId !== "string") {
      console.log("error: groupId is not string");
      return;
    }
    if (
      rankStateList
        .find((rankState) => rankState.rankName === "X")
        ?.userList.every((user) => user === "")
    ) {
      toast({
        title: "Xランクのメンバーを一人以上入力してください",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    let reqTeamGrouping: ReqTeamGrouping = {
      RankMembers: [],
      groupId: groupId,
    };
    rankStateList.forEach((rankState) => {
      let RankMembers: string[] = [];
      rankState.userList.forEach((user) => {
        if (user !== "") {
          RankMembers.push(user);
        }
      });
      reqTeamGrouping.RankMembers.push({
        rankId: rankState.uuid,
        rankName: rankState.rankName,
        userList: RankMembers,
      });
    });
    startLoading();
    axios
      .post("/api/team", reqTeamGrouping)
      .then((res) => {
        console.log(res);
        setRespTeamData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        stopLoading();
        setMode("result");
      });
  };
  return (
    <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
      <Heading>チーム作成</Heading>
      <Button
        color="white"
        bgColor="teal.400"
        onClick={() => postTeamMembers()}
      >
        このメンバーでチームを作成
      </Button>
      {rankStateList.length !== 0 &&
        rankStateList.map((rankState) => (
          <RankCard
            key={rankState.uuid}
            id={rankState.uuid}
            rank={rankState.rankName}
            rankColor={rankState.rankColor}
            rankStateList={rankStateList}
            rankState={rankState}
            createNewMember={createNewMember}
            deleteMember={deleteMember}
            onChangeUserName={onChangeUserName}
          ></RankCard>
        ))}
    </Flex>
  );
};

export default GroupMemberInputBox;
