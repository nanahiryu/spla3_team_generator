import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Header } from "../components/organisms/Header";

export default function Home() {
  const [userList, setUserList] = useState<Array<string>>(["a", "b", "c"]);
  return (
    <>
      <Header />
      <main>
        <Box m="8">
          <Heading>spla team generator</Heading>
        </Box>
        <Flex
          alignItems="center"
          w="100%"
          flexDirection="column"
          gap="2"
          py="4"
        >
          <Flex
            alignItems="center"
            flexDirection="column"
            w="80%"
            maxW="800px"
            gap="2"
            py="4"
            px="4"
            bg="teal.400"
            borderRadius="lg"
          >
            <Heading>Rank X</Heading>
            {userList.map((user) => (
              <Box
                key={user}
                bg="white"
                w="80%"
                p="4"
                border="4px"
                borderColor="teal.400"
                borderRadius="lg"
              >
                <Text>{user}</Text>
              </Box>
            ))}
          </Flex>
        </Flex>
      </main>
    </>
  );
}
