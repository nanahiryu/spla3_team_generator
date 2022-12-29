import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Header } from "../components/organisms/Header";
import { RankCard } from "../components/organisms/RankCard";
import { useLoadings } from "../Hooks/useLoadings";
import { RankStateType } from "../types/RankCard";
import { ReqTeamGrouping } from "../types/request/Team";

export default function Home() {
  const demoRankStateList: RankStateType[] = [
    {
      rankId: 0,
      rankName: "X",
      rankColor: "splaBlue",
      apperance: true,
      userList: ["", "", "", ""],
    },
    {
      rankId: 1,
      rankName: "S",
      rankColor: "splaLimeGreen",
      apperance: true,
      userList: ["", ""],
    },
    {
      rankId: 2,
      rankName: "A",
      rankColor: "splaTarcoids",
      apperance: false,
      userList: ["", ""],
    },
    {
      rankId: 3,
      rankName: "B",
      rankColor: "splaOrange",
      apperance: false,
      userList: ["", ""],
    },
  ];
  const { loading, startLoading, stopLoading } = useLoadings();
  const [rankStateList, setRankStateList] =
    useState<RankStateType[]>(demoRankStateList);
  const createNewMember = (rankId: number) => {
    let newUserList = [...rankStateList[rankId].userList];
    newUserList.push("");
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.rankId === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };
  const deleteMember = (rankId: number, orderInRank: number) => {
    let newUserList = [...rankStateList[rankId].userList];
    newUserList.splice(orderInRank, 1);
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.rankId === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };
  const onChangeUserName = (
    rankId: number,
    orderInRank: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUserName = e.target.value;
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.rankId === rankId
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
    let reqTeamGrouping: ReqTeamGrouping = { RankMembers: [] };
    rankStateList.forEach((rankState) => {
      let RankMembers: string[] = [];
      rankState.userList.forEach((user) => {
        if (user !== "") {
          RankMembers.push(user);
        }
      });
      reqTeamGrouping.RankMembers.push({
        rankId: rankState.rankId,
        rankName: rankState.rankName,
        userList: RankMembers,
      });
    });
    axios.post("/api/team", reqTeamGrouping);
  };

  if (loading) {
    return (
      <>
        <Flex>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      </>
    );
  }

  return (
    <>
      <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
        <Box>
          <Text fontSize="6xl">Home</Text>
        </Box>
        <Box>
          <Link href="/generator">generatorへ</Link>
        </Box>
      </Flex>
    </>
  );
}
