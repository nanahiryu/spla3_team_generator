import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputAddon,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { RankStateType } from "../../types/RankCard";

type RankCardProps = {
  id: number;
  rank: string;
  rankColor: string;
  rankStateList: RankStateType[];
  createNewMember: (rankId: number) => void;
  onChangeUserName: (
    rankId: number,
    orderInRank: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export const RankCard = ({
  id,
  rank,
  rankColor,
  rankStateList,
  createNewMember,
  onChangeUserName,
}: RankCardProps) => {
  const onCreateNewMember = useCallback(() => {
    createNewMember(id);
  }, [createNewMember, id]);
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      w="80%"
      maxW="800px"
      gap="2"
      py="4"
      px="4"
      bg={rankColor}
      borderRadius="lg"
    >
      <Heading color="white">Rank {rank}</Heading>
      <Stack spacing={6} my={2} w="90%">
        {rankStateList[id].userList.map((user, i) => (
          <Input
            key={i}
            size="lg"
            bgColor="white"
            placeholder="メンバー名を入力"
            value={user}
            onChange={(e) => onChangeUserName(id, i, e)}
          />
        ))}
        <Button onClick={onCreateNewMember}>plus</Button>
      </Stack>
    </Flex>
  );
};
