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
  id: string;
  rank: string;
  rankColor: string;
  rankStateList: RankStateType[];
  rankState: RankStateType;
  createNewMember: (rankId: string) => void;
  deleteMember: (rankId: string, orderInRank: number) => void;
  onChangeUserName: (
    rankId: string,
    orderInRank: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export const RankCard = ({
  id,
  rank,
  rankColor,
  rankStateList,
  rankState,
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
      shadow="md"
    >
      <Heading color="white">Rank {rank}</Heading>
      <Stack spacing={6} my={2} w="90%">
        {rankState.userList.map((user, i) => (
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
        <Flex maxW="100%" alignItems="center" justifyContent="center">
          <Button bgColor="white" onClick={onCreateNewMember}>
            メンバーを追加
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
};
