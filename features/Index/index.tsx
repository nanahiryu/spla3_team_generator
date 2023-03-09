import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthUser } from "../../Atoms";
import { useLoadings } from "../../Hooks/useLoadings";
import { LoadSpinner } from "../../components/atoms/loadSpinner";
import { useCreateGroup } from "../../Hooks/useCreateGroup";

const Home = () => {
  // const [userAuth, setUserAuth] = useAuthUser();
  const [groupName, setGroupName] = useState("");
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoadings();
  const { createGroup } = useCreateGroup();

  // useEffect(() => {
  //   if (!userAuth) {
  //     router.push("/signin");
  //   }
  //   console.log(userAuth);
  // });

  const onClickCreateNewGroup = async () => {
    try {
      const { data, error } = await createGroup(groupName);
      if (error) {
        throw error;
      }
      // データがない場合はreturn
      if (!data || !data[0]) {
        throw new Error("data is not exist");
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

  return (
    <>
      <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
        {loading ? (
          <LoadSpinner />
        ) : (
          <>
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
              <Button
                bgColor="teal.400"
                size="lg"
                onClick={onClickCreateNewGroup}
              >
                generatorへ
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};

export default Home;
