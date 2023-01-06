import { CreateToastFnReturn } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";

export const useSignIn = (
  toast: CreateToastFnReturn,
  loading: boolean,
  startLoading: () => void,
  stopLoading: () => void
) => {
  const router = useRouter();
  const signIn = (email: string, password: string) => {
    startLoading();
    supabase.auth
      .signInWithPassword({ email, password })
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          toast({
            title: "Sign in エラー",
            description: "サインインに失敗しました",
            status: "error",
            duration: 10000,
            isClosable: true,
            position: "top",
          });
        } else {
          router.push("/");
          console.log("sign in");
          console.log(res);
          toast({
            title: "Sign in 成功",
            description: "サインインに成功しました",
            status: "success",
            duration: 10000,
            isClosable: true,
            position: "top",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Sign in エラー",
          description: "サインインに失敗しました",
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "top",
        });
      });
    stopLoading();
  };
  return { signIn, loading };
};
