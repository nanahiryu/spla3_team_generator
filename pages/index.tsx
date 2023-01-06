import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthUser } from "../Atoms";
import { useLoadings } from "../Hooks/useLoadings";
import { RankStateType } from "../types/RankCard";

export default function Home() {
  // const [userAuth, setUserAuth] = useAuthUser();
  // const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoadings();

  // useEffect(() => {
  //   if (!userAuth) {
  //     router.push("/signin");
  //   }
  //   console.log(userAuth);
  // });

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
    <>
      <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
        <Box>
          <Text fontSize="6xl">Home</Text>
        </Box>
        <Box>
          <Link href="/generator">generatorへ</Link>
        </Box>
      </Flex>
    </>
  );
}
