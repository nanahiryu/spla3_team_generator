import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthUser } from "../../Atoms";
import { RankCard } from "../../components/organisms/RankCard";
import { useLoadings } from "../../Hooks/useLoadings";
import { RankStateType } from "../../types/RankCard";
import { ReqTeamGrouping } from "../../types/request/Team";
import { supabase } from "../../utils/supabase";
import { useAtom } from "jotai";
import { LoadSpinner } from "../../components/atoms/loadSpinner";
import { Player } from "../../types/RankCard";

type TeamData = {
  alpha: Player[];
  bravo: Player[];
};

export default function Generator() {
  const demoRankStateList: RankStateType[] = [
    {
      rankId: 0,
      rankName: "X",
      rankColor: "splaBlue",
      apperance: true,
      userList: ["", "", "", ""],
    },
    {
      rankId: 1,
      rankName: "S",
      rankColor: "splaLimeGreen",
      apperance: true,
      userList: ["", ""],
    },
    {
      rankId: 2,
      rankName: "A",
      rankColor: "splaTarcoids",
      apperance: false,
      userList: ["", ""],
    },
    {
      rankId: 3,
      rankName: "B",
      rankColor: "splaOrange",
      apperance: false,
      userList: ["", ""],
    },
  ];
  const { loading, startLoading, stopLoading } = useLoadings();
  const [rankStateList, setRankStateList] =
    useState<RankStateType[]>(demoRankStateList);
  // const [userAuth, setUserAuth] = useAuthUser();
  const [respTeamData, setRespTeamData] = useState<TeamData>();
  const router = useRouter();
  const createNewMember = (rankId: number) => {
    let newUserList = [...rankStateList[rankId].userList];
    newUserList.push("");
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.rankId === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };
  const deleteMember = (rankId: number, orderInRank: number) => {
    let newUserList = [...rankStateList[rankId].userList];
    newUserList.splice(orderInRank, 1);
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.rankId === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };
  const onChangeUserName = (
    rankId: number,
    orderInRank: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUserName = e.target.value;
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.rankId === rankId
          ? {
              ...rankState,
              userList: rankState.userList.map((user, i) =>
                i === orderInRank ? newUserName : user
              ),
            }
          : rankState
      )
    );
  };
  const postTeamMembers = () => {
    let reqTeamGrouping: ReqTeamGrouping = { RankMembers: [] };
    rankStateList.forEach((rankState) => {
      let RankMembers: string[] = [];
      rankState.userList.forEach((user) => {
        if (user !== "") {
          RankMembers.push(user);
        }
      });
      reqTeamGrouping.RankMembers.push({
        rankId: rankState.rankId,
        rankName: rankState.rankName,
        userList: RankMembers,
      });
    });
    startLoading();
    console.log(loading);
    axios
      .post("/api/team", reqTeamGrouping)
      .then((res) => {
        console.log(res);
        setRespTeamData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(loading);
    stopLoading();
  };

  // useEffect(() => {
  //   if (!userAuth) {
  //     router.push("/signin");
  //   }
  //   console.log(userAuth);
  // });

  return (
    <>
      <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
        {loading ? (
          <LoadSpinner />
        ) : (
          <>
            {respTeamData && (
              <Flex
                alignItems="center"
                w="100%"
                flexDirection="column"
                gap="4"
                mb="16"
                py="4"
              >
                <Heading>チーム分け</Heading>
                <Flex
                  alignItems="center"
                  flexDirection="column"
                  w="80%"
                  maxW="800px"
                  gap="2"
                  py="4"
                  px="4"
                  bg="pink.500"
                  borderRadius="lg"
                  shadow="md"
                >
                  <Heading color="white">team alpha</Heading>
                  <Stack spacing={6} my={2} w="90%">
                    {respTeamData.alpha.map((user) => (
                      <Flex
                        h={12}
                        key={`user-${user.playerId}`}
                        alignItems="center"
                      >
                        <Box bg="white" borderRadius="lg" w="100%" px="4">
                          <Text fontSize="2xl">{user.playerName}</Text>
                        </Box>
                      </Flex>
                    ))}
                  </Stack>
                </Flex>
                <Flex
                  alignItems="center"
                  flexDirection="column"
                  w="80%"
                  maxW="800px"
                  gap="2"
                  py="4"
                  px="4"
                  bg="pink.500"
                  borderRadius="lg"
                  shadow="md"
                >
                  <Heading color="white">team bravo</Heading>
                  <Stack spacing={6} my={2} w="90%">
                    {respTeamData.bravo.map((user) => (
                      <Flex
                        h={12}
                        key={`user-${user.playerId}`}
                        alignItems="center"
                      >
                        <Box bg="white" borderRadius="lg" w="100%" px="4">
                          <Text fontSize="2xl">{user.playerName}</Text>
                        </Box>
                      </Flex>
                    ))}
                  </Stack>
                </Flex>
                <Button bgColor="teal.400">もう一度振り分ける</Button>
              </Flex>
            )}
            {demoRankStateList.map((rankState) =>
              rankState.apperance ? (
                <RankCard
                  key={rankState.rankId}
                  id={rankState.rankId}
                  rank={rankState.rankName}
                  rankColor={rankState.rankColor}
                  rankStateList={rankStateList}
                  createNewMember={createNewMember}
                  deleteMember={deleteMember}
                  onChangeUserName={onChangeUserName}
                ></RankCard>
              ) : (
                <></>
              )
            )}
            <Button bgColor="teal.400" onClick={() => postTeamMembers()}>
              チームを作成する
            </Button>
          </>
        )}
      </Flex>
    </>
  );
}
