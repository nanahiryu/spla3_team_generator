import { Flex, Stack, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";

type SideBarProps = {
  groupName: string;
  mode: "input" | "result";
  setMode: React.Dispatch<React.SetStateAction<"input" | "result">>;
};

const SideBar = (props: SideBarProps) => {
  const { groupName, mode, setMode } = props;
  const router = useRouter();
  const toast = useToast();

  const onClickCopyUrl = () => {
    const currentUrl = `${window.location.protocol}/${window.location.host}${router.asPath}`;
    navigator.clipboard.writeText(currentUrl);
    toast({
      title: "URLをコピーしました",
      description: currentUrl,
      status: "success",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
  };

  return (
    <>
      <Flex
        direction="column"
        w="100%"
        bg="white"
        // headerを除いたfullの高さを指定
        minH="calc(100vh - 108px)"
        borderTopRightRadius="2xl"
      >
        <Flex w="100%" align="center" justify="center" my="6">
          <Flex
            w="90%"
            bgImage="url(/img/spla_ink_spread_bg.jpg)"
            bgSize="cover"
            align="center"
            justify="center"
            borderRadius="md"
            py="2"
          >
            <Flex
              align="center"
              justify="center"
              textShadow="0 0 40px black"
              backdropFilter="auto"
              backdropBrightness="50%"
              py="8"
              w="90%"
              gap="1"
              _hover={{ cursor: "pointer" }}
              onClick={onClickCopyUrl}
            >
              <MdContentCopy color="white" />
              <Text fontSize="2xl" fontWeight="semibold" color="whiteAlpha.900">
                {groupName}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <SelectTabGroup mode={mode} setMode={setMode} />
      </Flex>
    </>
  );
};

type SelectTabGroupProps = {
  mode: "input" | "result";
  setMode: React.Dispatch<React.SetStateAction<"input" | "result">>;
};

const SelectTabGroup = (props: SelectTabGroupProps) => {
  const { mode, setMode } = props;
  const [isSelectedInput, setIsSelectedInput] = useState(true);
  const [isSelectedResult, setIsSelectedResult] = useState(false);

  useEffect(() => {
    if (mode === "input") {
      setIsSelectedInput(true);
      setIsSelectedResult(false);
    } else if (mode === "result") {
      setIsSelectedInput(false);
      setIsSelectedResult(true);
    } else {
      console.log("error: mode is not input or result");
    }
    console.log(mode);
  }, [mode]);

  const onClickToggle = (tabMode: string) => {
    if (tabMode === "input" || tabMode === "result") setMode(tabMode);
  };

  return (
    <Stack w="100%" spacing="4" py="4">
      <SelectTab
        text="チーム作成"
        isSelected={isSelectedInput}
        tabMode="input"
        onClick={onClickToggle}
      />
      <SelectTab
        text="チーム分け結果"
        isSelected={isSelectedResult}
        tabMode="result"
        onClick={onClickToggle}
      />
    </Stack>
  );
};

type SelectTabProps = {
  text: string;
  isSelected: boolean;
  tabMode: string;
  onClick: (tabMode: string) => void;
};

const SelectTab = (props: SelectTabProps) => {
  const { text, isSelected, tabMode, onClick } = props;
  return (
    <>
      {isSelected ? (
        <Flex
          justify="end"
          bg="teal.50"
          borderRightWidth="12px"
          borderColor="teal.400"
          px="12"
          py="2"
          onClick={() => onClick(tabMode)}
        >
          <Text fontSize="2xl" fontWeight="semibold">
            {text}
          </Text>
        </Flex>
      ) : (
        <Flex
          justify="end"
          borderRightWidth="12px"
          borderColor="gray.400"
          px="12"
          py="2"
          _hover={{ bg: "gray.50", cursor: "pointer" }}
          onClick={() => onClick(tabMode)}
        >
          <Text fontSize="2xl" fontWeight="semibold" color="gray.400">
            {text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default SideBar;
