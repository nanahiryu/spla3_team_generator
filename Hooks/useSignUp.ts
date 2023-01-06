import { CreateToastFnReturn } from "@chakra-ui/react";
import { supabase } from "../utils/supabase";

export const useSignUp = (
  toast: CreateToastFnReturn,
  loading: boolean,
  startLoading: () => void,
  stopLoading: () => void
) => {
  const signUp = (email: string, password: string) => {
    startLoading();
    supabase.auth
      .signUp({ email, password })
      .then((res) => {
        // TODO: ログイン画面へ遷移 && メール送信のメッセージを表示
        toast({
          title: "Sign up 成功",
          description: "メールを送信したので認証を完了してください",
          status: "success",
          duration: 10000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((err) => {
        console.log(err);
        // TODO: chakra toast でエラーを表示
        toast({
          title: "Sign up エラー",
          description: "サインアップに失敗しました",
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "top",
        });
      });
    stopLoading();
  };
  return { signUp, loading };
};
