import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";

type RankCardProps = {
  rank: string;
  rankColor: string;
};

export const RankCard = ({ rank, rankColor }: RankCardProps) => {
  const [userList, setUserList] = useState<Array<string>>(["a", "b", "c"]);
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
      <Heading>Rank {rank}</Heading>
      {userList.map((user) => (
        <Box
          key={user}
          bg="white"
          w="80%"
          p="4"
          border="4px"
          borderColor={rankColor}
          borderRadius="lg"
        >
          <Text>{user}</Text>
        </Box>
      ))}
    </Flex>
  );
};
