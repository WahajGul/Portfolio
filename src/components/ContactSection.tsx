import { createElement, useRef, useState } from "react";
import { m } from "framer-motion";
import { Copy, Globe, Link as LinkIcon, Mail, Phone, type LucideIcon } from "lucide-react";
import { useContacts } from "../hooks/useContacts";
import { useReveal, type RevealState } from "../hooks/useReveal";
import {
  EASE_OUT,
  HEADING_DURATION,
  REVEAL_DURATION,
  REVEAL_STAGGER,
  headingWipe,
  revealRise,
} from "../lib/motion";
import type { Contact } from "../types";
import { EmptyState } from "./states/EmptyState";
import { ErrorState } from "./states/ErrorState";
import styles from "./ContactSection.module.css";

/** How many rows queue a stagger delay before the cap (DESIGN.md: max 4). */
const STAGGER_CAP = 4;

/*
 * Channel icons, keyed by the `icon` value in contacts.json. Only names that
 * carry meaning are mapped; anything unrecognised — including `github` and
 * `linkedin`, which lucide no longer ships as brand marks — falls back to a
 * plain link icon, so a new contact entry always renders with or without one.
 */
const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  globe: Globe,
};

const iconFor = (name: string | undefined): LucideIcon =>
  name === undefined ? LinkIcon : (ICONS[name] ?? LinkIcon);

/* Resolved here rather than bound to a capitalized local inside the row: the
   icons are static module-level components, and creating a component binding
   during render is what oxlint's static-components rule (rightly) objects to. */
const channelIcon = (name: string | undefined) =>
  createElement(iconFor(name), {
    className: styles.icon,
    "aria-hidden": true,
    size: 20,
  });

/** Only an address in a browser opens a new tab; mailto: and tel: stay put. */
const isExternal = (href: string): boolean => href.startsWith("http");

/** The one contact that gets a copy button is the one you send mail to. */
const isEmail = (href: string): boolean => href.startsWith("mailto:");

/*
 * Copy email: the confirmation is a live region, so it is seen and announced.
 * It only ever states one of two outcomes in words; a silent success would
 * leave a screen reader user guessing, and a silent failure would mislead
 * everyone. navigator.clipboard is absent outside a secure context, which is
 * why the failure path is real rather than theoretical.
 */
const CopyEmail = ({ value }: { value: string }) => {
  const [status, setStatus] = useState("");

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Email address copied.");
    } catch {
      setStatus("Could not copy. Select the address to copy it by hand.");
    }
  };

  return (
    <div className={styles.copy}>
      <button
        type="button"
        className={styles.copyButton}
        onClick={() => {
          void handleCopy();
        }}
      >
        <Copy aria-hidden="true" size={16} />
        Copy email
      </button>
      <p className={styles.copyStatus} role="status">
        {status}
      </p>
    </div>
  );
};

// One contact, rendered from the data alone: a channel name, its value as the
// link itself, and the copy button when the link is an email address. A new
// entry in contacts.json shows up here with no code change.
const ContactRow = ({
  contact,
  index,
  reveal,
}: {
  contact: Contact;
  index: number;
  reveal: RevealState;
}) => {
  const external = isExternal(contact.href);
  const delay = Math.min(index, STAGGER_CAP) * REVEAL_STAGGER;

  return (
    <m.li
      className={styles.contact}
      initial={false}
      animate={reveal}
      variants={revealRise}
      transition={
        reveal === "hidden"
          ? { duration: 0 }
          : {
              opacity: { duration: REVEAL_DURATION, ease: EASE_OUT, delay },
              y: { duration: REVEAL_DURATION, ease: EASE_OUT, delay },
            }
      }
    >
      {channelIcon(contact.icon)}
      <a
        className={styles.link}
        href={contact.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        <span className={styles.label}>{contact.label}</span>
        <span className={styles.value}>{contact.value}</span>
        {external && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
      {isEmail(contact.href) && <CopyEmail value={contact.value} />}
    </m.li>
  );
};

// Loading reserves three row-shaped placeholders, the same hairlines the rows
// themselves use, so the list landing does not move the footer.
const ContactSkeleton = () => (
  <div className={styles.skeleton} aria-hidden="true">
    {[0, 1, 2].map((row) => (
      <div className={styles.skeletonRow} key={row}>
        <span className={`${styles.skelBar} ${styles.skelLabel}`} />
        <span className={styles.skelBar} />
      </div>
    ))}
  </div>
);

export const ContactSection = () => {
  const { data: contacts, loading, error } = useContacts();
  const listRef = useRef<HTMLUListElement | null>(null);
  // The heading wipes in like every other section heading, on the same
  // visible-by-default contract as the rows below it.
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const headingReveal = useReveal(headingRef);
  // Visible by default; the list only drops into its pre-reveal state once the
  // motion chunk has resolved and only if it is still below the viewport then.
  const reveal = useReveal(listRef);
  const list = contacts ?? [];

  return (
    <section
      id="contact"
      className="band band-surface"
      aria-labelledby="contact-heading"
      aria-busy={loading}
    >
      <div className="container">
        <m.h2
          id="contact-heading"
          ref={headingRef}
          className="section-heading"
          initial={false}
          animate={headingReveal}
          variants={headingWipe}
          transition={
            headingReveal === "hidden"
              ? { duration: 0 }
              : { clipPath: { duration: HEADING_DURATION, ease: EASE_OUT } }
          }
        >
          Contact
        </m.h2>

        {loading && <ContactSkeleton />}
        {error !== null && <ErrorState />}

        {!loading && error === null && (
          <>
            {list.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className={styles.contacts} ref={listRef}>
                {list.map((contact, index) => (
                  <ContactRow
                    key={contact.id}
                    contact={contact}
                    index={index}
                    reveal={reveal}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
};
