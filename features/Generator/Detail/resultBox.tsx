import { Button, Flex, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";
import { TeamData } from ".";
import { TeamResultsCard } from "../../../components/organisms/TeamResultsCard";
import { Member } from "../../../types/RankCard";

type ResultBoxProps = {
  groupId: string | string[] | undefined;
  startLoading: () => void;
  stopLoading: () => void;
  respTeamData: TeamData;
  setRespTeamData: (teamData: TeamData) => void;
};

const ResultBox = (props: ResultBoxProps) => {
  const { groupId, startLoading, stopLoading, respTeamData, setRespTeamData } =
    props;
  const toast = useToast();
  const reroleMembers = (groupId: string | string[] | undefined) => {
    // get requestでgroupIdをqueryで渡す
    if (typeof groupId !== "string") {
      console.log("error: groupId is not string");
      return;
    }
    startLoading();
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
        if (err instanceof Error) {
          toast({
            title: err.message,
            status: "error",
            duration: 3000,
            position: "top",
            isClosable: true,
          });
        } else {
          toast({
            title: "チーム分け中に予期せぬエラーが発生しました",
            status: "error",
            duration: 3000,
            position: "top",
            isClosable: true,
          });
        }
      })
      .finally(() => {
        stopLoading();
      });
  };
  return (
    <>
      <Flex alignItems="center" w="100%" flexDirection="column" gap="4" py="4">
        <Heading>チーム分け結果</Heading>
        <Button
          color="white"
          bgColor="teal.400"
          onClick={() => reroleMembers(groupId)}
        >
          もう一度振り分ける
        </Button>
        <TeamResultsCard teamName="alpha" teamMembers={respTeamData.alpha} />
        <TeamResultsCard teamName="bravo" teamMembers={respTeamData.bravo} />
      </Flex>
    </>
  );
};

export default ResultBox;
