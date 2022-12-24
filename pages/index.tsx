import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Header } from "../components/organisms/Header";
import { RankCard } from "../components/organisms/RankCard";
import { RankStateType } from "../types/RankCard";

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
  return (
    <>
      <Box m="8">
        <Heading>spla team generator</Heading>
      </Box>
      <Flex alignItems="center" w="100%" flexDirection="column" gap="2" py="4">
        {demoRankStateList.map((rankState) =>
          rankState.apperance ? (
            <RankCard
              key={rankState.rankId}
              id={rankState.rankId}
              rank={rankState.rankName}
              rankColor={rankState.rankColor}
              rankStateList={rankStateList}
              createNewMember={createNewMember}
              onChangeUserName={onChangeUserName}
            ></RankCard>
          ) : (
            <></>
          )
        )}
        <Button bgColor="teal.400" onClick={() => console.log(rankStateList)}>
          Submit
        </Button>
      </Flex>
    </>
  );
}
