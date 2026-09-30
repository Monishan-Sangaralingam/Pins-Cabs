"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Clipboard, ExternalLink, LocateFixed, Phone, RotateCcw, Users } from "lucide-react";
import { business } from "@/config/business";
import { services, vehicles } from "@/data/content";
import { formatEnquiry, whatsappUrl, type PlannerState } from "@/lib/enquiry";
import { usePlanner } from "./PlannerProvider";
import { TripTypeSelector } from "./TripTypeSelector";
import { RideTypeSelector } from "./RideTypeSelector";

import { LocationInput, JourneyMap } from "@/components/location/LocationInput";

const steps = ["Journey", "Vehicle", "Contact", "Review"];

function sriLankaNow() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: business.timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

function validate(step: number, data: PlannerState) {
  const errors: Record<string,string> = {};
  if (step === 0) {
    if (!data.pickupLocation) errors.pickup = "Enter a pickup location.";
    if (!data.destinationLocation) errors.destination = "Enter a destination.";
    if (data.pickupLocation && data.destinationLocation && Math.abs(data.pickupLocation.latitude - data.destinationLocation.latitude) < 0.00001 && Math.abs(data.pickupLocation.longitude - data.destinationLocation.longitude) < 0.00001) errors.destination = "Pickup and destination must be different.";
    if (!data.date) errors.date = "Choose a pickup date.";
    if (!data.time) errors.time = "Choose a pickup time.";
    if (!Number.isInteger(data.passengers) || data.passengers < 1 || data.passengers > 55) errors.passengers = "Enter between 1 and 55 passengers.";
    if (data.date && data.time) {
      const now = sriLankaNow(); const current = `${now.year}-${now.month}-${now.day}T${now.hour}:${now.minute}`;
      if (`${data.date}T${data.time}` < current) errors.date = "Pickup time must be in the future (Sri Lanka time).";
    }
    if (data.tripType === "return") {
      if (!data.returnDate || !data.returnTime) errors.returnDate = "Add the return date and time.";
      else if (`${data.returnDate}T${data.returnTime}` <= `${data.date}T${data.time}`) errors.returnDate = "Return must be after pickup.";
    }
  }
  if (step === 1 && !data.vehicle) errors.vehicle = "Choose a vehicle class or ask us to recommend one.";
  if (step === 2) {
    if (!data.name.trim()) errors.name = "Enter your name.";
    if (!/^\+?[0-9 ()-]{7,20}$/.test(data.phone.trim())) errors.phone = "Enter a valid phone number with country code if outside Sri Lanka.";
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Enter a valid email or leave it blank.";
  }
  return errors;
}

export function PlanRideWizard() {
  const { state, update, reset } = usePlanner();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const eligible = useMemo(() => vehicles.filter((v) => v.passengers >= state.passengers), [state.passengers]);
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === state.vehicle);

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (requestedService && services.some((service) => service.id === requestedService)) update({ service: requestedService });
  // Apply only the service passed by the entry link on first mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function proceed() {
    const nextErrors = validate(step, state); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true'], [data-invalid='true']")?.focus()); return; }
    setStep((current) => Math.min(current + 1, 3)); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function copy() {
    try { await navigator.clipboard.writeText(formatEnquiry(state)); setCopied(true); setCopyFailed(false); }
    catch { setCopyFailed(true); }
  }
  const field = (name: string) => ({ "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });
  return <section className="planner-page shell" ref={formRef}>
    <div className="planner-intro"><span className="eyebrow">Plan · choose · enquire</span><h1>Let’s plan your ride.</h1><p>Four quick steps. Nothing is sent until you choose to open WhatsApp.</p></div>
    <ol className="stepper" aria-label="Ride enquiry progress">{steps.map((label, index) => <li key={label} className={index === step ? "active" : index < step ? "done" : ""}><button type="button" onClick={() => index < step && setStep(index)} disabled={index > step}><span>{index < step ? <Check size={15}/> : index + 1}</span>{label}</button></li>)}</ol>
    <div className="planner-layout">
      <details className="mobile-trip-summary">
        <summary><span><small>Trip summary</small><b>{state.pickup || "Pickup"} → {state.destination || "Destination"}</b></span><i aria-hidden="true">⌄</i></summary>
        <div className="mobile-summary-body"><dl><div><dt>Service</dt><dd>{services.find((s) => s.id === state.service)?.name}</dd></div><div><dt>When</dt><dd>{state.date ? `${state.date}${state.time ? ` · ${state.time}` : ""}` : "Not selected"}</dd></div><div><dt>Guests</dt><dd>{state.passengers} · {state.luggage} bags</dd></div><div><dt>Vehicle</dt><dd>{selectedVehicle?.name ?? (state.vehicle === "assisted" ? "Recommendation requested" : "Not selected")}</dd></div></dl><div><span><LocateFixed size={15}/>Sri Lanka time</span><button type="button" onClick={reset}>Reset trip</button></div></div>
      </details>
      <div className="wizard-card">
        {step === 0 && <div className="wizard-panel"><div className="panel-heading"><span>01</span><div><h2>Your journey</h2><p>Search, use your current location, or choose a point on the map.</p></div></div>
          <RideTypeSelector/>
          <TripTypeSelector/>
          <div className="form-grid"><LocationInput kind="pickup" error={errors.pickup}/><LocationInput kind="destination" error={errors.destination}/>
            <label><span>Pickup date</span><input type="date" value={state.date} onFocus={(event) => { const now = sriLankaNow(); event.currentTarget.min = `${now.year}-${now.month}-${now.day}`; }} onChange={(e) => update({ date: e.target.value })} {...field("date")}/>{errors.date && <small id="date-error" className="field-error">{errors.date}</small>}</label><label><span>Pickup time</span><input type="time" value={state.time} onChange={(e) => update({ time: e.target.value })} {...field("time")}/>{errors.time && <small id="time-error" className="field-error">{errors.time}</small>}</label>
            {state.tripType === "return" && <><label><span>Return date</span><input type="date" min={state.date || undefined} value={state.returnDate} onChange={(e) => update({ returnDate: e.target.value })} {...field("returnDate")}/>{errors.returnDate && <small id="returnDate-error" className="field-error">{errors.returnDate}</small>}</label><label><span>Return time</span><input type="time" value={state.returnTime} onChange={(e) => update({ returnTime: e.target.value })}/></label></>}
            <label><span>Passengers</span><input type="number" inputMode="numeric" min="1" max="55" step="1" value={state.passengers || ""} onChange={(e) => { const value = e.target.value; update({ passengers: value === "" ? 0 : Math.min(55, Number(value)), vehicle: "" }); }} onBlur={() => { if (!Number.isInteger(state.passengers) || state.passengers < 1) update({ passengers: 1 }); }} {...field("passengers")}/>{errors.passengers && <small id="passengers-error" className="field-error">{errors.passengers}</small>}</label><label><span>Luggage pieces</span><input type="number" min="0" max="30" value={state.luggage} onChange={(e) => update({ luggage: Math.max(0, Math.min(30, Number(e.target.value))) })}/></label>
            {state.service === "airport" && <label className="full"><span>Flight number <em>optional</em></span><input value={state.flight} onChange={(e) => update({ flight: e.target.value })} placeholder="e.g. UL 504"/></label>}
          </div>
          <button type="button" className="swap-button" onClick={() => update({ pickup: state.destination, destination: state.pickup, pickupLocation: state.destinationLocation, destinationLocation: state.pickupLocation })}><RotateCcw size={16}/>Swap pickup and destination</button>
          <JourneyMap/>
        </div>}
        {step === 1 && <div className="wizard-panel"><div className="panel-heading"><span>02</span><div><h2>Choose a vehicle</h2><p>Class images and capacities are illustrative until the real fleet is confirmed.</p></div></div>
          <div className="vehicle-options" aria-describedby={errors.vehicle ? "vehicle-error" : undefined}>{eligible.map((vehicle) => <button type="button" key={vehicle.id} className={state.vehicle === vehicle.id ? "active" : ""} onClick={() => { update({ vehicle: vehicle.id }); setErrors({}); }}><Image src={vehicle.image} alt="" width={110} height={82}/><span><b>{vehicle.name}</b><small><Users size={14}/> {vehicle.type === "Lorry" ? "Driver + 1 passenger" : `Up to ${vehicle.passengers} guests`}</small></span><i>{state.vehicle === vehicle.id && <Check/>}</i></button>)}</div>
          {(eligible.length === 0 || state.luggage > 10) && <div className="notice">Your group, seating layout or luggage may need manual confirmation. Bus and van capacities are guidance only until PINS Cabs confirms the exact vehicle.</div>}
          <button type="button" className={`recommend-option ${state.vehicle === "assisted" ? "active" : ""}`} onClick={() => { update({ vehicle: "assisted" }); setErrors({}); }}>Request a suitable vehicle</button>
          {errors.vehicle && <small id="vehicle-error" className="field-error">{errors.vehicle}</small>}
        </div>}
        {step === 2 && <div className="wizard-panel"><div className="panel-heading"><span>03</span><div><h2>Your contact details</h2><p>Used only to prepare your message. Details stay in memory and are not stored by this site.</p></div></div>
          <div className="form-grid"><label><span>Your name</span><input autoComplete="name" value={state.name} onChange={(e) => update({ name: e.target.value })} {...field("name")}/>{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label><label><span>Phone number</span><input autoComplete="tel" value={state.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="+94 ..." {...field("phone")}/>{errors.phone && <small id="phone-error" className="field-error">{errors.phone}</small>}</label><label className="full"><span>Email <em>optional</em></span><input type="email" autoComplete="email" value={state.email} onChange={(e) => update({ email: e.target.value })} {...field("email")}/>{errors.email && <small id="email-error" className="field-error">{errors.email}</small>}</label><label className="full"><span>Pickup instructions or requirements <em>optional</em></span><textarea maxLength={500} rows={5} value={state.notes} onChange={(e) => update({ notes: e.target.value })} placeholder="Landmark, child seat request, accessibility needs…"/><small>{state.notes.length}/500</small></label></div>
        </div>}
        {step === 3 && <div className="wizard-panel review-panel"><div className="panel-heading"><span>04</span><div><h2>Ready to enquire</h2><p>Review the details, then open WhatsApp. You will still need to press send.</p></div></div>
          <div className="review-block"><div><span>Journey</span><button onClick={() => setStep(0)}>Edit</button></div><p><b>{state.pickup}</b> → <b>{state.destination}</b></p><small>{state.date} at {state.time} · {business.timezone} · {state.passengers} guest(s) · {state.luggage} bag(s)</small></div>
          <div className="review-block"><div><span>Vehicle</span><button onClick={() => setStep(1)}>Edit</button></div><p><b>{selectedVehicle?.name ?? "Suitable vehicle requested"}</b></p></div>
          <div className="review-block"><div><span>Contact</span><button onClick={() => setStep(2)}>Edit</button></div><p><b>{state.name}</b> · {state.phone}</p>{state.email && <small>{state.email}</small>}</div>
          <div className="confirmation-note"><Check size={20}/><p>This is a ride enquiry. Your booking is confirmed only after PINS Cabs confirms availability and the final price.</p></div>
          <div className="review-actions"><a className="button button--lime" href={whatsappUrl(state)} target="_blank" rel="noreferrer">Continue to WhatsApp <ExternalLink size={18}/></a><button type="button" className="button button--outline" onClick={copy}>{copied ? <><Check size={18}/>Copied</> : <><Clipboard size={18}/>Copy enquiry</>}</button></div>
          {copyFailed && <div className="copy-fallback"><p>Clipboard access was blocked. Select and copy this message:</p><textarea readOnly value={formatEnquiry(state)} rows={12}/></div>}
          <p className="whatsapp-hint">Your enquiry is ready. Send it in WhatsApp to contact PINS Cabs.</p>
        </div>}
        <div className="wizard-footer">{step > 0 ? <button type="button" className="text-button" onClick={() => setStep(step - 1)}><ArrowLeft size={17}/>Back</button> : <Link className="text-button" href="/#home-top"><ArrowLeft size={17}/>Home</Link>}{step < 3 && <button type="button" className="button button--dark" onClick={proceed}>Continue <ArrowRight size={18}/></button>}</div>
      </div>
      <aside className="trip-summary desktop-trip-summary"><div><span className="eyebrow">Trip summary</span><button type="button" onClick={reset}>Reset</button></div><h3>{state.pickup || "Pickup"}<span>to</span>{state.destination || "Destination"}</h3><dl><div><dt>Service</dt><dd>{services.find((s) => s.id === state.service)?.name}</dd></div><div><dt>When</dt><dd>{state.date ? `${state.date}${state.time ? ` · ${state.time}` : ""}` : "Not selected"}</dd></div><div><dt>Guests</dt><dd>{state.passengers} · {state.luggage} bags</dd></div><div><dt>Vehicle</dt><dd>{selectedVehicle?.name ?? (state.vehicle === "assisted" ? "Recommendation requested" : "Not selected")}</dd></div></dl><p><LocateFixed size={16}/>All times use {business.timezone}.</p><a href={`tel:${business.phoneHref}`}><Phone size={17}/>Need help? {business.phoneDisplay}</a></aside>
    </div>
  </section>;
}
