import { useEffect, useState, useCallback } from "react";
import { useGoogleLogin, useGoogleOneTapLogin, googleLogout } from "@react-oauth/google";
import { NextPage } from "next";
import Head from "next/head";
import BackgroundGradient from "../components/background-gradient";
import Card from "../components/card";
import client from "../config-client";
import classNames from "classnames";
import "@fontsource/space-grotesk/400.css"; // Specify weight

const Home: NextPage = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | undefined>(undefined);
  const [receiving, setReceiving] = useState(false);
  
  const spaceGroteskClass = spaceGrotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
  });

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse);
      setIsSignedIn(true);
    },
  });

  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log(credentialResponse);
      setIsSignedIn(true);
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  const start = useCallback(async () => {
    setResult("");
    setReceiving(true);

    const response = await fetch("/api/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input ? input : client.exampleInput,
      }),
    });

    if (!response.ok) {
      setReceiving(false);
      console.error("Error in request");
      return;
    }

    const data = await response.json();

    if (!data) {
      console.error("No data received");
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResult((prev) => prev + chunkValue);
    }

    setReceiving(false);
  }, [input]);

  const logout = () => {
    setIsSignedIn(false);
    googleLogout();
  };


  if (!isSignedIn) {
    return <div>Please login to continue</div>;
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden isolate flex-col items-center justify-start py-2 bg-gray-100 text-black dark:bg-neutral-900 dark:text-gray-100">
      <Head>
        <title>{client.appName}</title>
        <link rel="icon" href={client.appLogo} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet" />
      </Head>
      <BackgroundGradient className="top-0 left-0 h-96 w-48 bg-indigo-500/30 duration-500 dark:bg-blue-500/40" />
      <BackgroundGradient className="left-60 top-96 h-64 w-72 rounded-lg bg-blue-500/30  duration-700 dark:bg-indigo-500/40" />
      <BackgroundGradient className="right-96 bottom-60 h-60 w-60 rounded-lg bg-red-500/30 dark:bg-violet-500/30" />
      <BackgroundGradient className="right-0 bottom-0 h-48 w-96 rounded-full bg-orange-500/30dark:bg-cyan-500/30" />
      <main className="flex w-full flex-1 flex-col items-center p-5 text-center">
    {client.appLogo ? (
      <img className="w-20 mt-20 h-20 rounded-2xl" src={client.appLogo} alt="App Logo" />
    ) : undefined}
    <h1
      className={classNames(
        "text-3xl sm:text-6xl font-bold",
        client.appLogo ? "mt-10" : "mt-48"
      )}
    >
      <span
        className="text-blue-600"
        style={{
          color: client.appThemeColor,
        }}
      >
        {client.appName}
      </span>
    </h1>

    <p className="mt-3 max-w-lg opacity-70">{client.appSummary}</p>

    <Card className="p-0 overflow-hidden mt-10 w-full h-36 max-w-lg bg-blue-100/20">
      <textarea
        className="bg-transparent w-full h-full outline-none p-4 resize-none"
        placeholder={client.exampleInput}
        autoFocus
        rows={3}
        value={input}
        onChange={(event) => {
          setInput(event.currentTarget.value);
        }}
      />
    </Card>

      <button
    className={classNames(
      spaceGroteskClass !== undefined ? spaceGroteskClass : "",
      "text-white rounded-xl px-5 py-2 m-5 text-xl font-bold hover:opacity-70 transition-all duration-300 disabled:opacity-50"
    )}
    style={{ background: client.appThemeColor }}
    disabled={receiving}
    onClick={start}
  >
    Start
  </button>

    {result !== undefined ? (
      <Card
        className="overflow-hidden break-words text-start w-full max-w-lg bg-blue-100/20"
        style={{
          minHeight: "9rem;",
        }}
      >
        <pre className="p-4 whitespace-pre-wrap">{result}</pre>
      </Card>
    ) : undefined}

    <button onClick={logout}>Logout</button>
  </main>

  <footer className="flex h-24 w-full items-center justify-center">
      <button
      className={classNames(
        spaceGroteskClass !== undefined ? spaceGroteskClass : "",
        "mt-5 mr-5 text-white rounded-xl px-5 py-2 text-xl font-bold hover:opacity-70 transition-all duration-300"
      )}
      style={{ background: client.appThemeColor }}
      onClick={() => window.open('https://www.buymeacoffee.com/zenchant', '_blank')}
    >
      Buy me a 🥑?
    </button>

    <div className="mt-5 mr-5 text-xs bg-black bg-opacity-50 text-white p-2 rounded">
      🥑  🥑  If you find yourself learning, consider supporting me or checking out my art! 🥑  🥑
    </div>
  </footer>
</div>
);
};

export default Home;

function spaceGrotesk(arg0: { subsets: string[]; variable: string; }) {
  throw new Error("Function not implemented.");
}
