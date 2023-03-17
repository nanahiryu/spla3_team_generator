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
      w="80%"
      maxW="800px"
      gap="2"
      py="4"
      px="8"
      bg={rankColor}
      borderRadius="lg"
      shadow="md"
      filter="saturate(80%)"
    >
      <Box alignItems="center" justifyContent="center" mr="8">
        <Flex alignItems="center" justifyContent="center">
          <Text color="gray.700" fontSize="3xl" fontWeight="bold">
            Rank {rank}
          </Text>
        </Flex>
        <Flex maxW="100%" alignItems="center" justifyContent="center">
          <Button bgColor="white" onClick={onCreateNewMember}>
            メンバーを追加
          </Button>
        </Flex>
      </Box>
      <Stack spacing={4} my={1} w="90%">
        {rankState.userList.map((user, i) => (
          <Flex h={10} key={`${id}-${i}`} alignItems="center">
            <Input
              size="md"
              fontSize="xl"
              fontWeight="semibold"
              bgColor="white"
              mr={2}
              placeholder={
                rank === "X" && i === 0
                  ? "メンバー名を入力(必須)"
                  : "メンバー名を入力"
              }
              value={user}
              onChange={(e) => onChangeUserName(id, i, e)}
            />
            <Button
              color="white"
              variant="outline"
              border="2px"
              borderColor="white"
              bgColor="red"
              h="100%"
              onClick={() => deleteMember(id, i)}
            >
              del
            </Button>
          </Flex>
        ))}
      </Stack>
    </Flex>
  );
};
