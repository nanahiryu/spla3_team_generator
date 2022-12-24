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
  deleteMember: (rankId: number, orderInRank: number) => void;
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
  deleteMember,
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
          <Flex h={12} key={`${id}-${i}`} alignItems="center">
            <Input
              size="lg"
              bgColor="white"
              mr={2}
              placeholder="メンバー名を入力"
              value={user}
              onChange={(e) => onChangeUserName(id, i, e)}
            />
            <Button
              color="white"
              bgColor="red"
              h="100%"
              onClick={() => deleteMember(id, i)}
            >
              del
            </Button>
          </Flex>
        ))}
        <Button onClick={onCreateNewMember}>メンバーを追加</Button>
      </Stack>
    </Flex>
  );
};
