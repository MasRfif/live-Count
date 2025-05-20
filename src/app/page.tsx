import Head from "next/head";
import LiveViewerChart from "@/components/LiveViewerChart";

export default function Home() {
  return (
    <>
      <Head>
        <title>Live Viewer Graph</title>
      </Head>
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <LiveViewerChart />
      </main>
    </>
  );
}
