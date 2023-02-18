import { Button, Flex, Heading } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthUser } from "../../Atoms";
import { RankCard } from "../../components/organisms/RankCard";
import { useLoadings } from "../../Hooks/useLoadings";
import { Member, RankStateType } from "../../types/RankCard";
import { ReqTeamGrouping } from "../../types/request/Team";
import { supabase } from "../../utils/supabase";
import { useAtom } from "jotai";
import { LoadSpinner } from "../../components/atoms/loadSpinner";
import { TeamResultsCard } from "../../components/organisms/TeamResultsCard";

type TeamData = {
  alpha: Member[];
  bravo: Member[];
};

export default function Generator() {
  const { loading, startLoading, stopLoading } = useLoadings();
  const [rankStateList, setRankStateList] = useState<RankStateType[]>([]);
  // const [userAuth, setUserAuth] = useAuthUser();
  const [respTeamData, setRespTeamData] = useState<TeamData>();
  const router = useRouter();
  const { groupId } = router.query;
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
              userList: ["", ""],
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
    let newUserList: string[] = [];
    const selectedRankState = rankStateList.find((rankState) => {
      return rankState.uuid === rankId;
    });
    if (selectedRankState) {
      newUserList = [...selectedRankState.userList];
    }
    newUserList.push("");
    console.log("newUserList", newUserList);
    setRankStateList(
      rankStateList.map((rankState) =>
        rankState.uuid === rankId
          ? { ...rankState, userList: newUserList }
          : rankState
      )
    );
  };

  const deleteMember = (rankId: string, orderInRank: number) => {
    let newUserList: string[] = [];
    const selectedRankState = rankStateList.find((rankState) => {
      return rankState.uuid === rankId;
    });
    if (selectedRankState) {
      newUserList = [...selectedRankState.userList];
    }
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
                i === orderInRank ? newUserName : user
              ),
            }
          : rankState
      )
    );
  };
  const postTeamMembers = () => {
    if (typeof groupId !== "string") {
      console.log("error: groupId is not string");
      return;
    }
    let reqTeamGrouping: ReqTeamGrouping = {
      RankMembers: [],
      groupId: groupId,
    };
    rankStateList.forEach((rankState) => {
      let RankMembers: string[] = [];
      rankState.userList.forEach((user) => {
        if (user !== "") {
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
    console.log(loading);
    axios
      .post("/api/team", reqTeamGrouping)
      .then((res) => {
        console.log(res);
        setRespTeamData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        stopLoading();
      });
  };

  const reroleMembers = (groupId: string | string[] | undefined) => {
    // get requestでgroupIdをqueryで渡す
    if (typeof groupId !== "string") {
      console.log("error: groupId is not string");
      return;
    }
    startLoading();
    console.log(loading);
    axios
      .get("/api/team/rerole/", {
        params: {
          groupId: groupId,
        },
      })
      .then((res) => {
        setRespTeamData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        stopLoading();
      });
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
                <Button
                  bgColor="teal.400"
                  onClick={() => reroleMembers(groupId)}
                >
                  もう一度振り分ける
                </Button>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </>
  );
}
