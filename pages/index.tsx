import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Header } from "../components/organisms/Header";
import { RankCard } from "../components/organisms/RankCard";
import { RankStateType } from "../types/RankCard";

export default function Home() {
  const demoRankStateList: RankStateType[] = [
    { rankName: "X", rankColor: "splaTarcoids" },
    { rankName: "S", rankColor: "splaBlue" },
    { rankName: "A", rankColor: "splaPink" },
    { rankName: "B", rankColor: "splaOrange" },
  ];
  return (
    <>
      <Header />
      <main>
        <Box m="8">
          <Heading>spla team generator</Heading>
        </Box>
        <Flex
          alignItems="center"
          w="100%"
          flexDirection="column"
          gap="2"
          py="4"
        >
          {demoRankStateList.map((rankState) => (
            <RankCard
              key={rankState.rankName}
              rank={rankState.rankName}
              rankColor={rankState.rankColor}
            ></RankCard>
          ))}
        </Flex>
      </main>
    </>
  );
}
