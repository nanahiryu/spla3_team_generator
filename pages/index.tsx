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
import { supabase } from "../utils/supabase";
import { Database } from "../types/schema";

export default function Home() {
  // const [userAuth, setUserAuth] = useAuthUser();
  const [groupName, setGroupName] = useState("");
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoadings();

  // useEffect(() => {
  //   if (!userAuth) {
  //     router.push("/signin");
  //   }
  //   console.log(userAuth);
  // });

  const onClickCreateNewGroup = async () => {
    try {
      const { data } = await supabase
        .from("groups")
        .insert({ name: groupName })
        .select();
      // データがない場合はreturn
      if (!data || !data[0]) {
        console.log("data is not exist");
        return;
      }
      // uuidを使って動的ルーティング
      router.push({
        pathname: `/generator/${data[0].uuid}`,
        query: { groupId: data[0].uuid },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
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
    <>
      <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
        <Box>
          <Text fontSize="6xl">Home</Text>
        </Box>
        <Flex flexDirection="column" gap="4" w="80">
          <Input
            placeholder="作成するチームの名前を入力"
            value={groupName}
            onChange={(e) => onChangeGroupName(e)}
            bgColor="white"
            size="lg"
          />
          <Button bgColor="teal.400" size="lg" onClick={onClickCreateNewGroup}>
            generatorへ
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
