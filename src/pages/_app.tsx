import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";

import "~/styles/globals.css";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Twitter Clone </title>
        <meta name="description" content="Twitter clone using T3 stack" />
      </Head>
      <div className="container mx-auto flex">
        <div className="min-h-screen flex-grow border-x">
          {/* <SideNav/> */}
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
