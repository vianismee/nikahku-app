"use client";

import { useState, useEffect } from "react";
import type { InvitationPageProps } from "./types";

import CoverSection from "./sections/cover";
import OpenRevealSection from "./sections/open-reveal";
import CoupleSection from "./sections/couple";
import CoupleProfileSection from "./sections/couple-profile";
import CountdownSection from "./sections/countdown";
import EventCardSection from "./sections/event-card";
import GallerySection from "./sections/gallery";
import LoveStorySection from "./sections/love-story";
import LoveGiftSection from "./sections/love-gift";
import WishesSection from "./sections/wishes";
import FooterSection from "./sections/footer";
import MusicPlayer from "./sections/music-player";

import "./heritage-01-jawa.css";

const A = "/templates/heritage-01-jawa/assets";

export default function Heritage01Jawa({ data }: { data: InvitationPageProps }) {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestId, setGuestId] = useState<string | null>(null);

  // Guest lookup from ?to= or ?g= param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (to) {
      setGuestName(decodeURIComponent(to));
      return;
    }
    const g = params.get("g");
    if (g) {
      fetch(`/api/i/${data.slug}/guest?nano_id=${encodeURIComponent(g)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.name) setGuestName(d.name);
          if (d?.id) setGuestId(d.id);
        })
        .catch(() => {});
    }
  }, [data.slug]);

  // Scroll lock
  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    document.body.style.overflow = "";
    // Auto-play music when opening
    if (data.musicUrl) {
      setMusicPlaying(true);
    }
  };

  return (
    <div className="h-invitation">
      {/* Load FontAwesome CSS */}
      <link rel="stylesheet" href={`${A}/fontawesome.min.css`} />
      <link rel="stylesheet" href={`${A}/solid.min.css`} />
      <link rel="stylesheet" href={`${A}/regular.min.css`} />
      <link rel="stylesheet" href={`${A}/brands.min.css`} />

      {!opened ? (
        <CoverSection data={data} guestName={guestName} onOpen={handleOpen} />
      ) : (
        <>
          <OpenRevealSection data={data} />
          <CoupleSection data={data} />
          <CoupleProfileSection data={data} />
          <CountdownSection data={data} />
          <EventCardSection data={data} />
          <GallerySection data={data} />
          <LoveStorySection data={data} />
          <LoveGiftSection data={data} />
          {data.showWishes && (
            <WishesSection
              data={data}
              guestId={guestId}
              guestName={guestName}
            />
          )}
          <FooterSection data={data} />
        </>
      )}

      <MusicPlayer
        src={data.musicUrl}
        playing={musicPlaying}
        onToggle={() => setMusicPlaying((p) => !p)}
      />
    </div>
  );
}
