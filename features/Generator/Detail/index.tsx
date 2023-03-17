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

export type TeamData = {
  alpha: Member[];
  bravo: Member[];
};

const GroupDetailPage = () => {
  const { loading, startLoading, stopLoading } = useLoadings();
  // const [userAuth, setUserAuth] = useAuthUser();
  const [respTeamData, setRespTeamData] = useState<TeamData>();
  const [mode, setMode] = useState<"input" | "result">("input");
  const router = useRouter();
  const { groupId, groupName } = router.query;

  // useEffect(() => {
  //   if (!userAuth) {
  //     router.push("/signin");
  //   }
  //   console.log(userAuth);
  // });

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

  useEffect(() => {
    console.log(mode);
    console.log(respTeamData);
  }, [mode]);

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
    <Flex alignItems="start" justifyContent="center" w="100%" gap="4" py="4">
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
