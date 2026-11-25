import InvitationShell from "@/components/InvitationShell";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import EventsTimeline from "@/components/EventsTimeline";
import Gallery from "@/components/Gallery";
import RsvpForm from "@/components/RsvpForm";
import DressCode from "@/components/DressCode";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <InvitationShell>
      <Hero />
      <Countdown />
      <EventsTimeline />
      <Gallery />
      <RsvpForm />
      <DressCode />
      <Footer />
    </InvitationShell>
  );
}
