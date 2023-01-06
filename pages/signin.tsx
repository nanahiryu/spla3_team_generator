import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { SignInCard } from "../components/organisms/signInCard";
import { SignUpCard } from "../components/organisms/signUpCard";
import { useLoadings } from "../Hooks/useLoadings";
import { useSignIn } from "../Hooks/useLogin";
import { useSignUp } from "../Hooks/useSignUp";

const Signin: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [titleText, setTitleText] = useState("Log in");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const toast = useToast();
  const { loading, startLoading, stopLoading } = useLoadings();
  const { signIn } = useSignIn(toast, loading, startLoading, stopLoading);
  const { signUp } = useSignUp(toast, loading, startLoading, stopLoading);
  const handleSignin = (email: string, password: string) => {
    signIn(email, password);
  };
  const handleSignup = (email: string, password: string) => {
    signUp(email, password);
  };

  const onClickLinkSignUpPage = () => {
    setMode("signup");
    setTitleText("Sign up");
  };

  const goBackSignIn = () => {
    setMode("login");
    setTitleText("Log in");
  };

  if (loading) {
    return (
      <>
        <Flex>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      </>
    );
  }

  return (
    <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
      <Box>
        <Text fontSize="6xl" my="12">
          {titleText}
        </Text>
      </Box>
      {mode === "login" ? (
        <SignInCard
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleSignin={handleSignin}
          onClickLinkSignUpPage={onClickLinkSignUpPage}
        />
      ) : (
        <SignUpCard
          email={signUpEmail}
          password={signUpPassword}
          setEmail={setSignUpEmail}
          setPassword={setSignUpPassword}
          handleSignup={handleSignup}
          goBackSignIn={goBackSignIn}
        />
      )}
    </Flex>
  );
};

export default Signin;
