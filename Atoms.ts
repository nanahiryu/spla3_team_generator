import { atom, useAtomValue, useAtom } from "jotai";
import { supabase } from "./utils/supabase";

export type AuthUser = {
  uid: string | null;
  email: string | null;
};

type AuthUserOrNull = AuthUser | null;

const authUserState = atom<Promise<AuthUserOrNull> | AuthUserOrNull>(null);

authUserState.onMount = (setAtom) => {
  // a: 最初の認証状態を取得した時に解決するPromiseを初期値に設定
  let resolvePromise: (value: AuthUserOrNull) => void;
  const initialValue = new Promise<AuthUserOrNull>((resolve) => {
    resolvePromise = resolve;
  });
  setAtom(initialValue);

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event: any, session: any) => {
      if (event === "SIGNED_IN") {
        const { id, email } = session?.user!;
        const authUser = {
          uid: id ?? null,
          email: email ?? null,
        };
        resolvePromise(authUser);
        setAtom(authUser);
        console.log("signed in");
      } else {
        // reload時にsessionが残っている場合は、sessionからauthUserを取得する
        supabase.auth.getSession().then((res) => {
          if (res.error) {
            console.log(res.error);
          } else {
            console.log("session: ");
            console.log(res.data);
            const { id, email } = res?.data?.session?.user!;
            const authUser = {
              uid: id ?? null,
              email: email ?? null,
            };
            resolvePromise(authUser);
            setAtom(authUser);
          }
        });
      }
    }
  );
  // d: 監視を終了する関数を返す
  // return () => {
  // authListener.subscription.unsubscribe;
  // };
  return;
};

// e: atomの値をサブスクライブするフック
export function useAuthUser() {
  // useStateのValueのみ返す
  return useAtom(authUserState);
}
