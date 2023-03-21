import { Button, Flex, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useAuthUser } from "../../../Atoms";
import { useLoadings } from "../../../Hooks/useLoadings";
import { Member, RankStateType } from "../../../types/RankCard";
import { LoadSpinner } from "../../../components/atoms/loadSpinner";
import ResultBox from "./resultBox";
import GroupMemberInputBox from "./groupMemberInputBox";
import SideBar from "./SideBar";
import { supabase } from "../../../utils/supabase";
import { useGroupName } from "../../../Hooks/useGroupName";

export type TeamData = {
  alpha: Member[];
  bravo: Member[];
};

const GroupDetailPage = () => {
  // const [userAuth, setUserAuth] = useAuthUser();
  const [respTeamData, setRespTeamData] = useState<TeamData>();
  const [mode, setMode] = useState<"input" | "result">("input");
  const [groupId, setGroupId] = useState<string | undefined>();
  const [groupName, setGroupName] = useState<string | undefined>();
  const router = useRouter();
  const toast = useToast();
  const { fetchGroupName } = useGroupName(groupId as string, setGroupName);

  // useEffect(() => {
  //   if (!userAuth) {
  //     router.push("/signin");
  //   }
  //   console.log(userAuth);
  // });

  useEffect(() => {
    setGroupId(router.query.groupId as string);
  }, [router]);

  useEffect(() => {
    try {
      fetchGroupName();
    } catch (error) {
      toast({
        title: "グループ名の取得に失敗しました",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  }, [groupId]);

  return (
    <>
      <Flex w="100%">
        <Flex w="400px">
          <SideBar
            mode={mode}
            setMode={setMode}
            groupName={groupName as string}
          />
        </Flex>
        <Flex w="100%">
          <>
            <MainContents
              groupId={groupId as string}
              respTeamData={respTeamData}
              setRespTeamData={setRespTeamData}
              mode={mode}
              setMode={setMode}
            />
          </>
        </Flex>
      </Flex>
    </>
  );
};

type MainContentsProps = {
  groupId: string;
  respTeamData: TeamData | undefined;
  setRespTeamData: React.Dispatch<React.SetStateAction<TeamData | undefined>>;
  mode: "input" | "result";
  setMode: React.Dispatch<React.SetStateAction<"input" | "result">>;
};

const MainContents = (props: MainContentsProps) => {
  const { groupId, respTeamData, setRespTeamData, mode, setMode } = props;
  const { loading, startLoading, stopLoading } = useLoadings();

  const ContentSwitch = () => {
    switch (mode) {
      case "input":
        return (
          <GroupMemberInputBox
            groupId={groupId}
            startLoading={startLoading}
            stopLoading={stopLoading}
            setRespTeamData={setRespTeamData}
            setMode={setMode}
          />
        );
      case "result":
        return (
          <>
            {!respTeamData ? (
              <>
                <Flex mt="10%">
                  <Flex
                    bgImage="url(/img/under_construction_bg.jpeg)"
                    bgSize="cover"
                    w="600px"
                    h="auto"
                    align="center"
                    justify="center"
                    px="4"
                    py="8"
                  >
                    <Flex
                      align="center"
                      justify="center"
                      textShadow="0 0 40px black"
                      backdropFilter="auto"
                      backdropBrightness="30%"
                      py="20"
                      px="4"
                    >
                      <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        color="whiteAlpha.800"
                      >
                        チームを作成するとここにチーム分け結果が表示されます
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </>
            ) : (
              <ResultBox
                groupId={groupId}
                startLoading={startLoading}
                stopLoading={stopLoading}
                respTeamData={respTeamData}
                setRespTeamData={setRespTeamData}
              />
            )}
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <Flex
      h="calc(100vh - 108px)"
      alignItems="start"
      justifyContent="center"
      w="100%"
      gap="4"
      py="4"
      overflow="auto"
      borderTop="2px"
      borderTopColor="gray.200"
    >
      {loading ? (
        <LoadSpinner />
      ) : (
        <>
          <ContentSwitch />
        </>
      )}
    </Flex>
  );
};

export default GroupDetailPage;
