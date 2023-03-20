import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  List,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
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
      w="45%"
      justify="start"
      align="center"
      borderRadius="xl"
    >
      <Text fontSize="xl" fontWeight="semibold" my="4">
        {title}
      </Text>
      <Box h="220px">
        <Box borderRadius="xl" overflow="hidden" maxH="200px">
          <Image
            src={fig_path}
            alt=""
            width={400}
            height={200}
            style={{ objectFit: "cover" }}
          />
        </Box>
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

  const onClickCreateNewGroup = async (event: FormEvent) => {
    event.preventDefault();
    try {
      // groupNameが空またはスペースのみの場合はthrow
      if (!groupName || !groupName.trim()) {
        throw new Error("groupName is empty");
      }
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
      <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="8">
        {loading ? (
          <LoadSpinner />
        ) : (
          <>
            <Box fontSize="3xl" fontWeight="semibold" mt="12">
              グループ名を入力してspla team generatorを始める
            </Box>
            <Flex
              as="form"
              w="full"
              justify="center"
              align="center"
              onSubmit={onClickCreateNewGroup}
            >
              <FormControl display="flex" flexDirection="column" w="80" gap="4">
                <Input
                  placeholder="グループの名前を入力"
                  value={groupName}
                  onChange={(e) => onChangeGroupName(e)}
                  bgColor="white"
                  size="lg"
                />
                <Button
                  type="submit"
                  bgColor="teal.400"
                  color="white"
                  size="lg"
                  onClick={onClickCreateNewGroup}
                >
                  グループを作成する
                </Button>
              </FormControl>
            </Flex>

            <Box fontSize="3xl" fontWeight="semibold" mt="24">
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
            <Box mt="24">
              <Text fontSize="3xl" fontWeight="semibold">
                spla team generator でできること
              </Text>
            </Box>
            <Flex gap="4" w="90%" justify="center" flexWrap="wrap">
              <DescriptionCard
                title="1. チーム名を入力"
                description="以下のボックスにグループ名を入力し、グループを作成しましょう。"
                fig_path="/img/input_team_name.png"
              />
              <DescriptionCard
                title="2. チームメンバーをランクごとに登録"
                description="チームメンバーをウデマエごとに登録しましょう。(ゲーム内のウデマエと一致させる必要はありません。)"
                fig_path="/img/input_player_name.png"
              />
              <DescriptionCard
                title="3. 何度でもチームを生成"
                description="チームメンバーを登録したら、何度でもチームを生成することができます。二回目以降は、登録したチームメンバーがなるべく被らないようにチームが組まれます。"
                fig_path="/img/output_team.png"
              />
              <DescriptionCard
                title="4. urlを共有"
                description="サイドバーのネームタグをクリックすることでurlを保存, 共有でき, チームメンバーを再入力する手間が省けます。"
                fig_path="/img/copy_team_name.png"
              />
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};

export default Home;
