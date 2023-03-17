import {
  Box,
  Button,
  Flex,
  Input,
  List,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthUser } from "../../Atoms";
import { useLoadings } from "../../Hooks/useLoadings";
import { LoadSpinner } from "../../components/atoms/loadSpinner";
import { useCreateGroup } from "../../Hooks/useCreateGroup";
import Image from "next/image";

type DescriptionCardProps = {
  title: string;
  description: string;
  fig_path: string;
};

const DescriptionCard = (props: DescriptionCardProps) => {
  const { title, description, fig_path } = props;
  return (
    <Flex
      direction="column"
      bg="white"
      py="2"
      px="6"
      w="30%"
      justify="start"
      align="center"
      borderRadius="xl"
    >
      <Text fontSize="2xl" fontWeight="semibold" my="4">
        {title}
      </Text>
      <Box borderRadius="xl" overflow="hidden" h="220px">
        <Image
          src={fig_path}
          alt=""
          width={400}
          height={200}
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box m="4">
        <Text fontSize="lg" fontWeight="bold">
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

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
      <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="2">
        {loading ? (
          <LoadSpinner />
        ) : (
          <>
            <Flex flexDirection="column" gap="4" w="80">
              <Input
                placeholder="グループの名前を入力"
                value={groupName}
                onChange={(e) => onChangeGroupName(e)}
                bgColor="white"
                size="lg"
              />
              <Button
                bgColor="teal.400"
                color="white"
                size="lg"
                onClick={onClickCreateNewGroup}
              >
                グループを作成する
              </Button>
            </Flex>
            <Box fontSize="4xl" fontWeight="semibold">
              spla team generator とは
            </Box>
            <Box
              fontSize="xl"
              fontWeight="medium"
              bg="white"
              borderRadius="xl"
              w="70%"
              p="4"
            >
              <Text fontWeight="semibold" color="gray.600">
                spla team generator
                は、スプラトゥーン3のプライベートマッチのマッチングをサポートするツールです。
              </Text>
              <Text fontWeight="semibold" color="gray.600">
                このツールを使うと
              </Text>
              <OrderedList ml="10">
                <ListItem fontWeight="bold" fontSize="xl">
                  なんかあっちのチーム強すぎない...？
                </ListItem>
                <ListItem fontWeight="bold" fontSize="xl">
                  ずっと同じメンバーで戦わされてる...
                </ListItem>
              </OrderedList>
              <Text fontWeight="semibold" color="gray.600">
                が解消できるようになります。
              </Text>
            </Box>
            <Box>
              <Text fontSize="4xl" fontWeight="semibold">
                spla team generator でできること
              </Text>
            </Box>
            <Flex gap="4" w="90%" justify="center">
              <DescriptionCard
                title="1. チーム名を入力"
                description="以下のボックスにグループ名を入力し、グループを作成しましょう。"
                fig_path="/img/splatoon_train_bg.jpg"
              />
              <DescriptionCard
                title="2. チームメンバーをランクごとに登録"
                description="チームメンバーをウデマエごとに登録しましょう。(ゲーム内のウデマエと一致させる必要はありません。)"
                fig_path="/img/udemae_bg.jpeg"
              />
              <DescriptionCard
                title="3. 何度でもチームを生成"
                description="チームメンバーを登録したら、何度でもチームを生成することができます。二回目以降は、登録したチームメンバーがなるべく被らないようにチームが組まれます。"
                fig_path="/img/private_match_bg.jpg"
              />
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};

export default Home;
