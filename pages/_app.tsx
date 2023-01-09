import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { DataProvider } from "../contexts/DataContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
      <Toaster />
      <Component {...pageProps} />
    </DataProvider>
  );
}
