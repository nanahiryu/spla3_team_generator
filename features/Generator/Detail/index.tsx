import { Button, Flex, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useAuthUser } from "../../../Atoms";
import { useLoadings } from "../../../Hooks/useLoadings";
import { Member, RankStateType } from "../../../types/RankCard";
import { LoadSpinner } from "../../../components/atoms/loadSpinner";
import ResultBox from "./resultBox";
import GroupMemberInputBox from "./groupMemberInputBox";

export type TeamData = {
  alpha: Member[];
  bravo: Member[];
};

const GroupDetailPage = () => {
  const { loading, startLoading, stopLoading } = useLoadings();
  // const [userAuth, setUserAuth] = useAuthUser();
  const [respTeamData, setRespTeamData] = useState<TeamData>();
  const router = useRouter();
  const { groupId } = router.query;

  // useEffect(() => {
  //   if (!userAuth) {
  //     router.push("/signin");
  //   }
  //   console.log(userAuth);
  // });

  return (
    <>
      <Flex alignItems="start" justifyContent="center" w="100%" gap="4" py="4">
        {loading ? (
          <LoadSpinner />
        ) : (
          <>
            <GroupMemberInputBox
              groupId={groupId}
              startLoading={startLoading}
              stopLoading={stopLoading}
              setRespTeamData={setRespTeamData}
            />
            {respTeamData && (
              <ResultBox
                groupId={groupId}
                startLoading={startLoading}
                stopLoading={stopLoading}
                respTeamData={respTeamData}
                setRespTeamData={setRespTeamData}
              />
            )}
          </>
        )}
      </Flex>
    </>
  );
};

export default GroupDetailPage;
