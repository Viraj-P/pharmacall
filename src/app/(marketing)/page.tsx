import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Local SEO Audit</h1>
      <p className="mt-4 text-muted-foreground">
        Instantly audit a business website for on-page SEO, technical basics, local signals, performance, and content.
      </p>
      <div className="mt-8 flex justify-center">
        <Button asChild>
          <Link href="/new">Run an audit</Link>
        </Button>
      </div>
    </main>
  );
}
