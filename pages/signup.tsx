import { NextPage } from "next";
import { supabase } from "../utils/supabase";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

type IForm = {
  email: string;
  password: string;
};

const Signup: NextPage = () => {
  const handleSignup = ({ email, password }: IForm) => {
    supabase.auth.signUp({ email, password });
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
      <Box>
        <Text fontSize="6xl" my="12">
          Sign up
        </Text>
      </Box>
      <Box bgColor="white" p="12" borderRadius="xl">
        <Flex alignItems="center" p="4">
          <Box w="48">
            <Text fontSize="2xl">email</Text>
          </Box>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Flex>
        <Flex alignItems="center" p="4">
          <Box w="48">
            <Text fontSize="2xl">password</Text>
          </Box>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Flex>
        <Flex alignItems="center" justifyContent="center" gap="12" mt="8">
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => handleSignup({ email, password })}
          >
            register
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Signup;
