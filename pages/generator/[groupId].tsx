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
import { TeamResultsCard } from "../../components/organisms/TeamResultsCard";
import { useGenerateTeam } from "../../Hooks/useGenerateTeam";

export type TeamData = {
  alpha: Player[];
  bravo: Player[];
};

export default function Generator() {
  const router = useRouter();
  const { groupId } = router.query;
  const { loading, startLoading, stopLoading } = useLoadings();
  const [rankStateList, setRankStateList] = useState<RankStateType[]>([]);
  // const [userAuth, setUserAuth] = useAuthUser();
  const [respTeamData, setRespTeamData] = useState<TeamData>();
  const { getNewTeamData } = useGenerateTeam({
    setTeamData: setRespTeamData,
    groupId: groupId,
  });

  // rankStateListの初期化
  useEffect(() => {
    (async () => {
      console.log("async");
      try {
        startLoading();
        const { data } = await supabase.from("ranks").select();
        console.log(data);
        let newRankStateList: RankStateType[] = [];
        data?.forEach((rank) => {
          if (rank.name === "X" || rank.name === "S") {
            newRankStateList.push({
              uuid: rank.uuid,
              rankName: rank.name,
              rankColor: rank.rank_color,
              userList: [
                { playerId: "", playerName: "" },
                { playerId: "", playerName: "" },
              ],
            });
          } else {
            newRankStateList.push({
              uuid: rank.uuid,
              rankName: rank.name,
              rankColor: rank.rank_color,
              userList: [],
            });
          }
        });
        setRankStateList(newRankStateList);
      } catch (error) {
        console.log(error);
      } finally {
        stopLoading();
      }
    })();
    console.log("rankStateList:");
    console.log(rankStateList);
  }, []);
  const createNewMember = (rankId: string) => {
    let newUserList = [
      ...rankStateList.find((rankState) => {
        rankState.uuid === rankId;
      })!.userList,
    ];
    newUserList.push({ playerId: "", playerName: "" });
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.uuid === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };
  const deleteMember = (rankId: string, orderInRank: number) => {
    let newUserList = [
      ...rankStateList.find((rankState) => {
        rankState.uuid === rankId;
      })!.userList,
    ];
    newUserList.splice(orderInRank, 1);
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.uuid === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };
  const onChangeUserName = (
    rankId: string,
    orderInRank: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUserName = e.target.value;
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.uuid === rankId
          ? {
              ...rankState,
              userList: rankState.userList.map((user, i) =>
                i === orderInRank ? { ...user, playerName: newUserName } : user
              ),
            }
          : rankState
      )
    );
  };

  const postTeamMembers = () => {
    let reqTeamGrouping: ReqTeamGrouping = { RankMembers: [] };
    rankStateList.forEach((rankState) => {
      let RankMembers: Player[] = [];
      rankState.userList.forEach((user) => {
        if (user.playerName !== "") {
          RankMembers.push(user);
        }
      });
      reqTeamGrouping.RankMembers.push({
        rankId: rankState.uuid,
        rankName: rankState.rankName,
        userList: RankMembers,
      });
    });
    startLoading();
    const { alpha, bravo } = getNewTeamData(reqTeamGrouping);
    setRespTeamData({ alpha: alpha, bravo: bravo });
    // getNewTeamData(reqTeamGrouping).then((res) => {
    //   setRespTeamData({ alpha: res.alpha, bravo: res.bravo });
    //   console.log("res:", respTeamData);
    // });
    // axios
    //   .post("/api/team", reqTeamGrouping)
    //   .then((res) => {
    //     console.log(res);
    //     setRespTeamData(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // console.log(loading);
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
      <Flex alignItems="center" w="100%" gap="4" py="4">
        {loading ? (
          <LoadSpinner />
        ) : (
          <>
            <Flex
              alignItems="center"
              w="100%"
              flexDirection="column"
              gap="4"
              py="4"
            >
              <Heading>チーム作成</Heading>
              {rankStateList.length !== 0 &&
                rankStateList.map((rankState) => (
                  <RankCard
                    key={rankState.uuid}
                    id={rankState.uuid}
                    rank={rankState.rankName}
                    rankColor={rankState.rankColor}
                    rankStateList={rankStateList}
                    rankState={rankState}
                    createNewMember={createNewMember}
                    deleteMember={deleteMember}
                    onChangeUserName={onChangeUserName}
                  ></RankCard>
                ))}
              <Button bgColor="teal.400" onClick={() => postTeamMembers()}>
                チームを作成する
              </Button>
            </Flex>
            {respTeamData && (
              <Flex
                alignItems="center"
                w="100%"
                flexDirection="column"
                gap="4"
                mb="16"
                py="4"
              >
                <Heading>チーム分け結果</Heading>
                <TeamResultsCard
                  teamName="alpha"
                  teamMembers={respTeamData.alpha}
                />
                <TeamResultsCard
                  teamName="bravo"
                  teamMembers={respTeamData.bravo}
                />
                <Button bgColor="teal.400">もう一度振り分ける</Button>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </>
  );
}
