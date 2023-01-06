import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import React from "react";

type SignInCardProps = {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSignin: (email: string, password: string) => void;
  onClickLinkSignUpPage: () => void;
};

export const SignInCard = ({
  email,
  password,
  setEmail,
  setPassword,
  handleSignin,
  onClickLinkSignUpPage,
}: SignInCardProps) => {
  return (
    <>
      <Box bgColor="white" p="12" borderRadius="xl">
        <Flex alignItems="center" p="4">
          <Box w="48">
            <Text fontSize="2xl">email</Text>
          </Box>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            borderColor="gray.400"
          />
        </Flex>
        <Flex alignItems="center" p="4">
          <Box w="48">
            <Text fontSize="2xl">password</Text>
          </Box>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            borderColor="gray.400"
          />
        </Flex>
        <Flex alignItems="center" justifyContent="center" gap="12" mt="8">
          <Button
            size="lg"
            colorScheme="teal"
            onClick={() => handleSignin(email, password)}
          >
            Sign in
          </Button>
          <Button size="lg" colorScheme="blue" onClick={onClickLinkSignUpPage}>
            Sign up へ
          </Button>
        </Flex>
      </Box>
    </>
  );
};
