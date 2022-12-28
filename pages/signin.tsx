import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../utils/supabase";

type IForm = {
  email: string;
  password: string;
};

const Signin: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSignin = ({ email, password }: IForm) => {
    supabase.auth.signInWithPassword({ email, password });
  };

  const onClickLinkSignUpPage = () => {
    router.push("/signup");
  };

  return (
    <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
      <Box>
        <Text fontSize="6xl" my="12">
          Log in
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
            colorScheme="teal"
            onClick={() => handleSignin({ email, password })}
          >
            Sign in
          </Button>
          <Button size="lg" colorScheme="blue" onClick={onClickLinkSignUpPage}>
            Sign up
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Signin;
