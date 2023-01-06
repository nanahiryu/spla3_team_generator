import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import React from "react";

type SignUpCardProps = {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSignup: (email: string, password: string) => void;
  goBackSignIn: () => void;
};

export const SignUpCard = ({
  email,
  password,
  setEmail,
  setPassword,
  handleSignup,
  goBackSignIn,
}: SignUpCardProps) => {
  return (
    <div>
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
          <Button size="lg" colorScheme="red" onClick={goBackSignIn}>
            sign in に戻る
          </Button>
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => handleSignup(email, password)}
          >
            register
          </Button>
        </Flex>
      </Box>
    </div>
  );
};
