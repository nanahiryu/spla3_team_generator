import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <Box m="8">
        <Link href="/">
          <Heading>spla team generator</Heading>
        </Link>
      </Box>
    </>
  );
};
