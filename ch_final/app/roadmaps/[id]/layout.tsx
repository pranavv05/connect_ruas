import type { Metadata } from "next";
import { roadmapDetailMetadata } from "./metadata";

export const metadata: Metadata = roadmapDetailMetadata;

export default function RoadmapDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}