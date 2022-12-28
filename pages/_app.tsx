import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme/index";
import { Header } from "../components/organisms/Header";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLoadings } from "../Hooks/useLoadings";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const { pathname, push } = useRouter();
  const { loading, startLoading, stopLoading } = useLoadings();

  supabase.auth.onAuthStateChange((_, session) => {
    console.log(session);
    if (session?.user && (pathname === "/signin" || pathname === "/signup")) {
      push("/");
    } else if (!session?.user && pathname !== "/signup") {
      push("/signin");
    }
  });

  useEffect(() => {
    (async () => {
      startLoading();
      const userData = await supabase.auth.getUser();
      // userが存在かつ, signin, signupページにいる場合は, "/"にpush
      const user = userData.data?.user;
      console.log(user);
      if (user && (pathname === "/signin" || pathname === "/signup")) {
        await push("/");
      } else if (!user && pathname !== "/signup") {
        await push("/signin");
      }
      stopLoading();
    })();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>spla3 team generator</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
