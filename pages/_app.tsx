import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme/index";
import { Header } from "../components/organisms/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
