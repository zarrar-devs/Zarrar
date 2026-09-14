"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ContactModal.module.css";

// ---------------------------------------------------------------------
// Icons — one per option, all sharing the same stroke weight (1.6) so
// the set reads as one deliberate family. Rendered as `<opt.icon />`
// below, so each option object just points at one of these.
// ---------------------------------------------------------------------
function IconMic(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v4M8 22h8" />
    </svg>
  );
}

function IconStore(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 9v10h14V9" />
    </svg>
  );
}

function IconBriefcase(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

function IconSparkle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
    </svg>
  );
}

function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </svg>
  );
}

function IconPen(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 20l1-4L15 6l3 3L8 19l-4 1z" />
      <path d="M13 8l3 3" />
    </svg>
  );
}

function IconCode(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
    </svg>
  );
}

function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.5 5l-6 6 6 6" />
    </svg>
  );
}

function IconAlert(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 6.5v4M10 13.3h.01" />
      <circle cx="10" cy="10" r="8.2" />
    </svg>
  );
}

// Step 1 — "who is filling this out".
const ROLE_OPTIONS = [
  { id: "speaker", label: "Speaker", icon: IconMic },
  { id: "brand-owner", label: "Brand Owner", icon: IconStore },
  { id: "ceo-founder", label: "CEO / Founder", icon: IconBriefcase },
  { id: "other", label: "Other", icon: IconSparkle },
];

// Step 2 — "what they need help with".
const NEED_OPTIONS = [
  { id: "email-marketing", label: "Email Marketing", icon: IconMail },
  { id: "graphic-design", label: "Graphic Design", icon: IconPen },
  { id: "web-development", label: "Website Development", icon: IconCode },
  { id: "other", label: "Other", icon: IconSparkle },
];

const TOTAL_STEPS = 3;
const INITIAL_DETAILS = { name: "", email: "", message: "" };

// Your Formspree form endpoint. Every submission is emailed to
// whichever inbox is set up on the Formspree dashboard for this form.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdeorbky";

/**
 * Multi-step contact modal — black & white theme.
 *
 * Fully self-contained: it owns its own step/role/need/form state.
 * The parent only needs to control whether it's open, via `isOpen`
 * and `onClose`.
 */
export default function ContactModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [need, setNeed] = useState(null);
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const nameInputRef = useRef(null);

  // Reset the whole flow a moment after closing, so reopening it later
  // always starts fresh instead of resuming a half-filled form. The
  // small delay just avoids the fields visibly clearing mid closing-fade.
  useEffect(() => {
    if (isOpen) return;
    const timeout = setTimeout(() => {
      setStep(1);
      setRole(null);
      setNeed(null);
      setDetails(INITIAL_DETAILS);
      setSubmitting(false);
      setSubmitted(false);
      setError("");
    }, 300);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Lock page scroll behind the modal while it's open.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Autofocus the first field once the details step mounts.
  useEffect(() => {
    if (step === 3 && !submitted) {
      nameInputRef.current?.focus();
    }
  }, [step, submitted]);

  if (!isOpen) return null;

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.name.trim() || !details.email.trim() || !details.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setSubmitting(true);

    // Look up the human-readable labels for the step 1 / step 2 picks
    // (e.g. "speaker" -> "Speaker") so the email reads clearly instead
    // of showing raw ids.
    const roleLabel = ROLE_OPTIONS.find((o) => o.id === role)?.label || "Not specified";
    const needLabel = NEED_OPTIONS.find((o) => o.id === need)?.label || "Not specified";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          message: details.message,
          "Who they are": roleLabel,
          "What they need": needLabel,
          // Formspree reads this special field to set the email subject.
          _subject: `New project inquiry — ${roleLabel} / ${needLabel}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Formspree request failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close contact form"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {!submitted && (
          <>
            <div className={styles.header}>
              <span className={styles.headerEyebrow}>Start a Project</span>
              <span className={styles.headerStep}>
                Step {step} of {TOTAL_STEPS}
              </span>
            </div>

            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </>
        )}

        {submitted ? (
          <div className={styles.successState}>
            <div className={styles.successIcon} aria-hidden="true">
              <svg
                className={styles.successIconSvg}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" pathLength="1" />
              </svg>
            </div>
            <h3 id="contact-modal-heading" className={styles.successHeading}>
              Thank you, {details.name.split(" ")[0]}!
            </h3>
            <p className={styles.successText}>
              Our team will be in touch with you shortly.
            </p>
            <button type="button" className={styles.primaryButton} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div key={step} className={styles.stepPanel}>
                <h3 id="contact-modal-heading" className={styles.stepHeading}>
                  Who are you?
                </h3>
                <p className={styles.stepSubheading}>
                  Help us understand who we&rsquo;re talking to.
                </p>
                <div className={styles.optionGrid}>
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`${styles.optionButton} ${role === opt.id ? styles.optionButtonActive : ""}`}
                      onClick={() => {
                        setRole(opt.id);
                        goNext();
                      }}
                    >
                      <span className={styles.optionIconWrap} aria-hidden="true">
                        <opt.icon className={styles.optionIcon} />
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div key={step} className={styles.stepPanel}>
                <h3 id="contact-modal-heading" className={styles.stepHeading}>
                  What do you need help with?
                </h3>
                <p className={styles.stepSubheading}>
                  Pick the area you&rsquo;d like us to focus on.
                </p>
                <div className={styles.optionGrid}>
                  {NEED_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`${styles.optionButton} ${need === opt.id ? styles.optionButtonActive : ""}`}
                      onClick={() => {
                        setNeed(opt.id);
                        goNext();
                      }}
                    >
                      <span className={styles.optionIconWrap} aria-hidden="true">
                        <opt.icon className={styles.optionIcon} />
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button type="button" className={styles.backLink} onClick={goBack}>
                  <IconArrowLeft className={styles.backLinkIcon} />
                  Back
                </button>
              </div>
            )}

            {step === 3 && (
              <form key={step} className={styles.stepPanel} onSubmit={handleSubmit}>
                <h3 id="contact-modal-heading" className={styles.stepHeading}>
                  Almost there — your details
                </h3>
                <p className={styles.stepSubheading}>
                  We&rsquo;ll use this to get back to you.
                </p>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Name</span>
                  <input
                    ref={nameInputRef}
                    type="text"
                    className={styles.fieldInput}
                    value={details.name}
                    onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  <input
                    type="email"
                    className={styles.fieldInput}
                    value={details.email}
                    onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Message</span>
                  <textarea
                    className={styles.fieldTextarea}
                    value={details.message}
                    onChange={(e) => setDetails((d) => ({ ...d, message: e.target.value }))}
                    placeholder="Tell us a bit about your project"
                    rows={4}
                    required
                  />
                </label>

                {error && (
                  <p className={styles.errorBox}>
                    <IconAlert className={styles.errorIcon} />
                    {error}
                  </p>
                )}

                <div className={styles.stepActions}>
                  <button type="button" className={styles.backLink} onClick={goBack}>
                    <IconArrowLeft className={styles.backLinkIcon} />
                    Back
                  </button>
                  <button type="submit" className={styles.primaryButton} disabled={submitting}>
                    {submitting ? "Sending…" : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
