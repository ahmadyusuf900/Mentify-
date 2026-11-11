import { Suspense } from "react";
import { mentors } from "@/data/mentors";
import MentorBooking from "@/components/MentorBooking";

export function generateStaticParams() {
  return mentors.map((m) => ({ id: String(m.id) }));
}

async function MentorContent({ params }) {
  const { id } = await params;
  return <MentorBooking id={id} />;
}

export default function MentorDetail({ params }) {
  return (
    <Suspense fallback={<div className="container section muted">Memuat profil mentor…</div>}>
      <MentorContent params={params} />
    </Suspense>
  );
}