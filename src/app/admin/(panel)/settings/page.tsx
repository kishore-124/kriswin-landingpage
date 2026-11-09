import { getSettings } from "@/lib/data";
import { Area, Flash, Section, Text } from "@/components/admin/Fields";
import { PageTitle } from "@/components/admin/ui";
import RowsEditor from "@/components/admin/RowsEditor";
import ImageInput from "@/components/admin/ImageInput";
import SubmitButton from "@/components/admin/SubmitButton";
import SettingsTabs from "./SettingsTabs";
import { saveSettings } from "../../actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function SettingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const s = await getSettings();
  const tab = typeof sp.tab === "string" ? sp.tab : "general";
  const pane = (id: string) => ({ className: "settings-pane", "data-pane": id, style: id === tab ? undefined : { display: "none" } });

  return (
    <>
      <PageTitle
        title="Site Settings"
        subtitle="Company details and the content of the Home and About pages."
        actions={<a href="/" target="_blank" rel="noopener" className="btn btn-light border"><i className="bi bi-eye me-1" /> Preview website</a>}
      />
      <Flash sp={sp} />

      <form action={saveSettings}>
        <div className="row g-4">
          <div className="col-lg-3">
            <SettingsTabs initial={tab} />
          </div>

          <div className="col-lg-9">
            {/* ---------- General ---------- */}
            <div {...pane("general")}>
              <Section title="Company" desc="Shown in the header, footer and browser tab.">
                <Text name="companyName" label="Company name" defaultValue={s.companyName} col="col-md-6" />
                <Text name="tagline" label="Tagline" defaultValue={s.tagline} col="col-md-6" />
                <Area name="footerAbout" label="Footer description" defaultValue={s.footerAbout} rows={2} />
              </Section>
              <Section title="Logo" desc="SVG recommended. Remove a logo to go back to the default Kriswin logo.">
                <div className="col-md-6">
                  <label className="form-label">Main logo <span className="text-muted-2 fw-normal">(light backgrounds)</span></label>
                  <ImageInput name="logoUrl" fileName="logoFile" defaultValue={s.logoUrl} contain hint="Header, admin panel · SVG or PNG" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">White logo <span className="text-muted-2 fw-normal">(dark backgrounds)</span></label>
                  <ImageInput name="logoLightUrl" fileName="logoLightFile" defaultValue={s.logoLightUrl} dark contain hint="Footer, login page · SVG or PNG" />
                </div>
              </Section>
              <Section title="Brand colours" desc="Applied across the whole website instantly.">
                {([
                  ["primaryColor", "Primary colour", s.primaryColor, "Buttons, links and icons"],
                  ["accentColor", "Accent colour", s.accentColor, "Highlights and call-to-action buttons"],
                ] as const).map(([name, label, value, help]) => (
                  <div className="col-md-6" key={name}>
                    <label className="form-label" htmlFor={name}>{label}</label>
                    <div className="color-field">
                      <input type="color" defaultValue={value} aria-label={`Pick ${label}`} data-sync={name} />
                      <div className="flex-grow-1">
                        <input type="text" id={name} name={name} className="form-control" defaultValue={value} />
                        <div className="form-text m-0">{help}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </Section>
              <Section title="Search engines (SEO)">
                <Area name="metaDescription" label="Meta description" defaultValue={s.metaDescription} rows={3} help="Shown under your site name in Google results. Aim for 120–160 characters." />
              </Section>
            </div>

            {/* ---------- Contact ---------- */}
            <div {...pane("contact")}>
              <Section title="Contact details" desc="Used in the top bar, footer and Contact page.">
                <Text name="email" label="Email" type="email" defaultValue={s.email} col="col-md-6" prefix={<i className="bi bi-envelope" />} />
                <Text name="phone" label="Phone" defaultValue={s.phone} col="col-md-6" prefix={<i className="bi bi-telephone" />} />
                <Text name="whatsapp" label="WhatsApp number" defaultValue={s.whatsapp} col="col-md-6" prefix={<i className="bi bi-whatsapp" />} placeholder="919876543210" help="Country code + number, digits only. Leave empty to hide the WhatsApp button." />
                <Text name="address" label="Office address" defaultValue={s.address} col="col-md-6" prefix={<i className="bi bi-geo-alt" />} />
                <Text name="mapEmbedUrl" label="Google Maps embed URL" defaultValue={s.mapEmbedUrl} help='In Google Maps: Share → Embed a map → copy only the src="…" link. Leave empty to hide the map.' />
              </Section>
              <Section title="Social media" desc="Leave a field empty to hide that icon.">
                <Text name="linkedin" label="LinkedIn" defaultValue={s.linkedin} col="col-md-6" prefix={<i className="bi bi-linkedin" />} />
                <Text name="facebook" label="Facebook" defaultValue={s.facebook} col="col-md-6" prefix={<i className="bi bi-facebook" />} />
                <Text name="instagram" label="Instagram" defaultValue={s.instagram} col="col-md-6" prefix={<i className="bi bi-instagram" />} />
                <Text name="twitter" label="X / Twitter" defaultValue={s.twitter} col="col-md-6" prefix={<i className="bi bi-twitter-x" />} />
                <Text name="youtube" label="YouTube" defaultValue={s.youtube} col="col-md-6" prefix={<i className="bi bi-youtube" />} />
              </Section>
            </div>

            {/* ---------- Home ---------- */}
            <div {...pane("home")}>
              <Section title="Hero section" desc="The first thing visitors see.">
                <Text name="heroBadge" label="Small badge above the headline" defaultValue={s.heroBadge} />
                <Text name="heroTitle" label="Headline" defaultValue={s.heroTitle} help="The last two words are highlighted automatically." />
                <Area name="heroSubtitle" label="Sub-headline" defaultValue={s.heroSubtitle} rows={3} />
                <Text name="heroCtaText" label="Primary button" defaultValue={s.heroCtaText} col="col-md-6" />
                <Text name="heroCta2Text" label="Secondary button" defaultValue={s.heroCta2Text} col="col-md-6" />
              </Section>
              <Section title="Statistics" desc="Shown in the stats band and hero card.">
                <Text name="statYears" label="Years of experience" defaultValue={s.statYears} col="col-6 col-md-3" />
                <Text name="statClients" label="Happy clients" defaultValue={s.statClients} col="col-6 col-md-3" />
                <Text name="statProjects" label="Projects delivered" defaultValue={s.statProjects} col="col-6 col-md-3" />
                <Text name="statSupport" label="Uptime / support" defaultValue={s.statSupport} col="col-6 col-md-3" />
              </Section>
              <Section title="Why choose us">
                <RowsEditor name="whyUs" label="Reasons" defaultValue={s.whyUs} addLabel="Add reason"
                  columns={[{ key: "icon", label: "Icon", type: "icon" }, { key: "title", label: "Title", width: "col-md-9" }, { key: "text", label: "Description", type: "textarea" }]} />
              </Section>
              <Section title="Call-to-action banner" desc="Shown near the bottom of every page.">
                <Text name="ctaTitle" label="Title" defaultValue={s.ctaTitle} />
                <Text name="ctaSubtitle" label="Subtitle" defaultValue={s.ctaSubtitle} />
              </Section>
            </div>

            {/* ---------- Home sections ---------- */}
            <div {...pane("sections")}>
              <Section title="Trusted by" desc="Client / partner names in the scrolling strip under the hero. Remove all to hide.">
                <RowsEditor name="trustedBy" label="Names" defaultValue={s.trustedBy} addLabel="Add name" columns={[{ key: "name", label: "Client or partner name" }]} />
              </Section>
              <Section title="Problems we solve" desc="The “Sound familiar?” section.">
                <RowsEditor name="challenges" label="Problems" defaultValue={s.challenges} addLabel="Add problem"
                  columns={[{ key: "icon", label: "Icon", type: "icon" }, { key: "title", label: "Title", width: "col-md-9" }, { key: "text", label: "Description", type: "textarea" }]} />
              </Section>
              <Section title="Technologies" desc="Each row becomes a tab.">
                <RowsEditor name="technologies" label="Tabs" defaultValue={s.technologies} addLabel="Add tab"
                  columns={[{ key: "cat", label: "Tab name", width: "col-md-4" }, { key: "items", label: "Technologies, separated by commas", width: "col-md-8" }]} />
              </Section>
              <Section title="Industries">
                <RowsEditor name="industries" label="Industries" defaultValue={s.industries} addLabel="Add industry"
                  columns={[{ key: "icon", label: "Icon", type: "icon", width: "col-md-5" }, { key: "name", label: "Industry name", width: "col-md-7" }]} />
              </Section>
              <Section title="Free consultation" desc="Points shown next to the form on the Home page.">
                <RowsEditor name="consultPoints" label="What to expect" defaultValue={s.consultPoints} addLabel="Add point" columns={[{ key: "p", label: "Point" }]} />
              </Section>
              <Section title="FAQs">
                <RowsEditor name="faqs" label="Questions" defaultValue={s.faqs} addLabel="Add question"
                  columns={[{ key: "q", label: "Question", width: "col-12" }, { key: "a", label: "Answer", type: "textarea" }]} />
              </Section>
            </div>

            {/* ---------- About ---------- */}
            <div {...pane("about")}>
              <Section title="Our story">
                <Text name="aboutTitle" label="Heading" defaultValue={s.aboutTitle} />
                <Area name="aboutContent" label="About text" defaultValue={s.aboutContent} rows={8} help="Separate paragraphs with a blank line. The first paragraph also appears on the Home page." />
              </Section>
              <Section title="Mission & vision">
                <Area name="mission" label="Mission" defaultValue={s.mission} rows={4} col="col-md-6" />
                <Area name="vision" label="Vision" defaultValue={s.vision} rows={4} col="col-md-6" />
              </Section>
              <Section title="Core values">
                <RowsEditor name="values" label="Values" defaultValue={s.values} addLabel="Add value"
                  columns={[{ key: "t", label: "Value", width: "col-md-4" }, { key: "d", label: "Description", width: "col-md-8" }]} />
              </Section>
            </div>

            <div className="save-bar">
              <span><i className="bi bi-info-circle me-1" />Changes go live on the website as soon as you save.</span>
              <SubmitButton label="Save settings" />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
