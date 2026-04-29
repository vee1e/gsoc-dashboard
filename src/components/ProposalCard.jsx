import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faBuilding, faGraduationCap, faCodeBranch, faExternalLinkAlt, faUser, faGlobe, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faLinkedin,
  faTwitter,
  faMedium,
  faDev,
  faReddit,
  faDiscord,
  faStackOverflow,
  faGitlab,
  faGoogle
} from '@fortawesome/free-brands-svg-icons'

const socialIconMap = {
  github: faGithub,
  linkedin: faLinkedin,
  twitter: faTwitter,
  email: faEnvelope,
  gmail: faEnvelope,
  stackoverflow: faStackOverflow,
  gitlab: faGitlab,
  medium: faMedium,
  dev_to: faDev,
  reddit: faReddit,
  discord: faDiscord,
  website: faGlobe,
}

export function ProposalCard({ data }) {
  // Extract socials and links that have a value
  const socialLinks = [
    { key: 'website', link: data.website },
    { key: 'email', link: data.email ? `mailto:${data.email}` : (data.gmail ? `mailto:${data.gmail}` : null) },
    { key: 'github', link: data.github },
    { key: 'linkedin', link: data.linkedin },
    { key: 'twitter', link: data.twitter },
    { key: 'stackoverflow', link: data.stackoverflow },
    { key: 'gitlab', link: data.gitlab },
    { key: 'medium', link: data.medium },
    { key: 'dev_to', link: data.dev_to },
    { key: 'reddit', link: data.reddit },
    { key: 'discord', link: data.discord }
  ].filter(s => s.link && s.link.trim() !== '')

  return (
    <article className="h-full flex flex-col bg-[var(--color-brand-surface)] rounded-2xl border border-[var(--color-brand-border)] hover:bg-[#282A2C] transition-colors duration-200 overflow-hidden">
      
      {/* Header */}
      <header className="p-5 border-b border-[var(--color-brand-border)]">
        <h2 className="text-xl font-medium text-[var(--color-brand-accent)] leading-tight line-clamp-2 mb-4">
          {data.org || "Unknown Organization"}
        </h2>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--color-brand-bg)] text-[var(--color-brand-text)] rounded-md text-xs font-medium min-w-0" title={data.fullname || "Anonymous"}>
            <FontAwesomeIcon icon={faUser} className="text-[10px] text-[var(--color-brand-muted)] flex-shrink-0" />
            <span className="truncate">{data.fullname || "Anonymous"}</span>
          </span>
          {data.previous_no_of_prs_in_org && data.previous_no_of_prs_in_org !== "0" && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--color-brand-bg)] text-[var(--color-brand-muted)] rounded-md text-xs font-medium flex-shrink-0">
              <FontAwesomeIcon icon={faCodeBranch} className="text-[10px]" />
              {data.previous_no_of_prs_in_org} {data.previous_no_of_prs_in_org === "1" ? "PR" : "PRs"}
            </span>
          )}
          {data.pdf_filename && (
            <a 
              href={`/pdfs/${data.pdf_filename}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#A8C7FA]/10 text-[#A8C7FA] hover:bg-[#A8C7FA]/20 text-xs font-medium transition-colors flex-shrink-0 ml-auto"
            >
              <FontAwesomeIcon icon={faFilePdf} className="text-xs" />
              <span className="hidden sm:inline">Proposal</span>
              <span className="sm:hidden">PDF</span>
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Academic Info - Minimal */}
        {((data.college && data.college !== "Unknown College") || data.pdf_filename) && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-brand-muted)]">
            {data.college && data.college !== "Unknown College" && (
              <FontAwesomeIcon icon={faGraduationCap} className="opacity-70" />
            )}
            <span className="font-medium text-[var(--color-brand-text)]">
              {data.college && data.college !== "Unknown College" && (
                <>
                  {data.college}
                  {data.year_of_graduation && (
                    <span className="opacity-70"> '{data.year_of_graduation.slice(-2)}</span>
                  )}
                  {data.pdf_filename && <span className="opacity-70"> · </span>}
                </>
              )}
              {data.pdf_filename && (
                <span className="opacity-70">GSoC '{data.pdf_filename.split(' - ')[1].slice(-2)}</span>
              )}
            </span>
          </div>
        )}

        {/* Descriptions - Full content, not truncated */}
        <div className="space-y-4">
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[var(--color-brand-accent)] font-bold mb-2">
              About
            </h3>
            <p className="text-xs text-[var(--color-brand-muted)] leading-relaxed">
              {data.short_desc_about_contributor_40_words || "No description provided."}
            </p>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[var(--color-brand-accent)] font-bold mb-2">
              Proposal
            </h3>
            <p className="text-xs text-[var(--color-brand-muted)] leading-relaxed">
              {data.proposal_short_desc_40_words || "No proposal description."}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto px-5 py-4 border-t border-[var(--color-brand-border)] bg-[var(--color-brand-bg)]/50">
        <div className="flex items-center gap-2.5 flex-wrap">
          {socialLinks.length > 0 ? (
            socialLinks.map((social) => {
              const Icon = socialIconMap[social.key];
              const isUrl = social.link.startsWith('http') || social.link.startsWith('mailto');
              
              const iconButton = (
                <span
                  key={social.key}
                  className="w-7 h-7 rounded-full bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] flex items-center justify-center text-[var(--color-brand-muted)] hover:text-[var(--color-brand-accent)] hover:border-[var(--color-brand-accent)]/50 transition-all"
                  title={isUrl ? social.key : `${social.key}: ${social.link}`}
                >
                  <FontAwesomeIcon icon={Icon} className="text-xs" />
                </span>
              );
              
              return isUrl ? (
                <a
                  key={social.key}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {iconButton}
                </a>
              ) : iconButton;
            })
          ) : (
            <span className="text-[10px] text-[var(--color-brand-muted)] italic">No links</span>
          )}
        </div>
      </footer>
    </article>
  )
}
