import type { Metadata } from "next";
import { roadmapsMetadata } from "./metadata";

export const metadata: Metadata = roadmapsMetadata;

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}