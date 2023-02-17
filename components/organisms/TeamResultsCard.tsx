import React from "react";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Member, Player } from "../../types/RankCard";

type TeamResultsCardProps = {
  teamName: string;
  teamMembers: Member[];
};

export const TeamResultsCard = ({
  teamName,
  teamMembers,
}: TeamResultsCardProps) => {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      w="80%"
      maxW="800px"
      gap="2"
      py="4"
      px="4"
      bg="pink.500"
      borderRadius="lg"
      shadow="md"
    >
      <Heading color="white">team {teamName}</Heading>
      <Stack spacing={6} my={2} w="90%">
        {teamMembers.map((user) => (
          <Flex h={12} key={`user-${user.playerId}`} alignItems="center">
            <Box bg="white" borderRadius="lg" w="100%" px="4">
              <Text fontSize="2xl">{user.playerName}</Text>
            </Box>
          </Flex>
        ))}
      </Stack>
    </Flex>
  );
};
