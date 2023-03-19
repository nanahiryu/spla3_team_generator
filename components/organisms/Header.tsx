import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <Box m="8" w="400px">
        <Link tabIndex={-1} href="/">
          <Heading lineHeight="44px">spla team generator</Heading>
        </Link>
      </Box>
    </>
  );
};
