import { useState } from 'react'
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

/**
 * Map organization name to icon filename
 * Converts org name to snake_case and matches against available icons
 */
const ORG_ICON_MAP = {
  // Exact matches and common variations
  'AOSSIE': 'aossie',
  'AboutCode': 'aboutcode',
  'Accord Project': 'accord_project',
  'Alaska': 'alaska',
  'AnkiDroid': 'ankidroid',
  'Apache': 'apache_software_foundation',
  'Apertium': 'apertium',
  'Apertus': 'apertus',
  'AsyncAPI': 'asyncapi',
  'BeagleBoard': 'beagleboard',
  'Beehive': 'beehive',
  'Boost': 'boost',
  'C2SI': 'c2si',
  'CASTOR': 'castor',
  'CCExtractor': 'ccextractor_development',
  'CDLI': 'cuneiform_digital_library_initiative__cdli_',
  'CERN-HSF': 'cern_hsf',
  'CHAOSS': 'chaoss',
  'CNCF': 'cncf',
  'CVXPY': 'cvxpy',
  'Casbin': 'casbin',
  'Catrobat': 'international_catrobat_association',
  'Ceph': 'ceph',
  'Chapel': 'chapel',
  'Chromium': 'chromium',
  'Cilium': 'cilium',
  'CircuitVerse': 'circuitverse_org',
  'CloudCV': 'cloudcv',
  'Coala': 'coala',
  'CodeCombat': 'codecombat',
  'Continuous Delivery Foundation': 'continuous_delivery_foundation',
  'Creative Commons': 'creative_commons',
  'D4GC': 'data_for_the_common_good',
  'DBpedia': 'dbpedia',
  'DIAL': 'dial',
  'DatenLord': 'datenlord',
  'Debian': 'debian',
  'Drupal': 'drupal_association',
  'Elasticsearch': 'elasticsearch',
  'Emory BMI': 'emory_bmi',
  'Emory University': 'emory_university',
  'FLARE': 'flare',
  'FOSSASIA': 'fossasia',
  'Freifunk': 'freifunk',
  'GA4GH': 'global_alliance_for_genomics_and_health',
  'GFOSS': 'open_technologies_alliance___gfoss',
  'GNOME': 'gnome_foundation',
  'GNU Octave': 'gnu_octave',
  'Gambit': 'gambit__the_package_for_computation_in_game_theory',
  'Google DeepMind': 'google_deepmind',
  'Graphite': 'graphite',
  'Haskell.org': 'haskell_org',
  'Honeynet': 'the_honeynet_project',
  'HumanAI': 'humanai',
  'INCF': 'incf',
  'Inkscape': 'inkscape',
  'Intel': 'intel',
  'Internet Health Report': 'internet_health_report',
  'JDERobot': 'jderobot',
  'JPF': 'the_jpf_team',
  'JSON Schema': 'json_schema',
  'Joomla': 'joomla_',
  'Joplin': 'joplin',
  'Julia': 'julia',
  'JuliaDiffEq': 'juliadiffeq',
  'KDE': 'kde_community',
  'Kiwix': 'kiwix',
  'Kornia': 'kornia',
  'Kro': 'kro',
  'Kubeflow': 'kubeflow',
  'Kubevirt': 'kubevirt',
  'Learning Equality': 'learning_equality',
  'LibreCube': 'librecube_initiative',
  'LibreCube Initiative': 'librecube_initiative',
  'LibreHealth': 'librehealth',
  'LibreOffice': 'libreoffice',
  'Libreswan': 'the_libreswan_project',
  'Liquid Galaxy': 'liquid_galaxy_project',
  'MIT App Inventor': 'mit_app_inventor',
  'ML4SCI': 'machine_learning_for_science__ml4sci_',
  'MLPack': 'mlpack',
  'Mathesar': 'mathesar',
  'MediaWiki': 'mediawiki',
  'Mesa': 'project_mesa',
  'MetaBrainz': 'metabrainz_foundation_inc',
  'Metacall': 'metacall',
  'Mozilla': 'mozilla',
  'NRNB': 'national_resource_for_network_biology__nrnb_',
  'NumFOCUS': 'numfocus',
  'OSGeo': 'osgeo__open_source_geospatial_foundation_',
  'OSIPI': 'osipi',
  'OWASP': 'owasp_foundation',
  'Open Source Robotics Foundation': 'open_source_robotics_foundation',
  'OpenAstronomy': 'openastronomy',
  'OpenScienceLabs': 'open_science_labs',
  'OpenWISP': 'openwisp',
  'Oppia': 'oppia',
  'PEcAn': 'pecan',
  'Palisadoes Foundation': 'palisadoes_foundation',
  'Pharo Consortium': 'pharo_consortium',
  'Pitivi': 'pitivi',
  'Processing Foundation': 'processing_foundation',
  'Prometheus-Operator': 'prometheus_operator',
  'Public Lab': 'public_lab',
  'Purr Data': 'purr_data',
  'PyBaMM': 'pybamm',
  'Python Software Foundation': 'python_software_foundation',
  'R Project for Statistical Computing': 'r_project_for_statistical_computing',
  'RoboComp': 'robocomp',
  'Robolectric': 'robolectric',
  'Rocket.Chat': 'rocket_chat',
  'Rocket.chat': 'rocket_chat',
  'SAT': 'sat',
  'SBI': 'sbi',
  'SCoRe': 'scorelab',
  'SciML': 'sciml',
  'ScummVM': 'scummvm',
  'SoSy Lab': 'sosy_lab',
  'Software Heritage': 'software_heritage',
  'Stichting SU2': 'stichting_su2',
  'Stratosphere Research Laboratory': 'stratosphere_research_laboratory',
  'Submitty': 'submitty',
  'Sugar Labs': 'sugar_labs',
  'SymPy': 'sympy',
  'TARDIS SN': 'tardis',
  'TensorFlow': 'tensorflow',
  'Tiled': 'tiled',
  'UAF': 'uaf',
  'UC OSPO': 'uc_ospo',
  'UCCROSS': 'uccross',
  'Unicode': 'unicode',
  'VideoLAN': 'videolan',
  'Wagtail': 'wagtail',
  'WikiLoop': 'wikiloop',
  'Wikimedia': 'wikimedia_foundation',
  'Zulip': 'zulip',
  'cBioPortal': 'cbioportal_for_cancer_genomics',
  'jQuery': 'jquery',
  'libcamera': 'libcamera',
  'libssh': 'libssh',
  'omegaUp': 'omegaup',
  'pgRouting': 'pgrouting',
  'xrdesktop': 'xrdesktop',
}

function getOrgIconPath(orgName) {
  if (!orgName) return null

  // Check for exact match in mapping
  if (ORG_ICON_MAP[orgName]) {
    return `/icons/${ORG_ICON_MAP[orgName]}.png`
  }

  // Convert to snake_case: lowercase, replace non-alphanumeric with underscore
  const snakeCase = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return `/icons/${snakeCase}.png`
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

  const orgIconPath = getOrgIconPath(data.org)
  const [iconError, setIconError] = useState(false)

  return (
    <article className="h-full flex flex-col bg-[var(--color-brand-surface)] rounded-2xl border border-[var(--color-brand-border)] hover:bg-[#282A2C] transition-colors duration-200 overflow-hidden">
      
      {/* Header */}
      <header className="p-4 sm:p-5 pb-3 sm:pb-4 border-b border-[var(--color-brand-border)]">
        {/* Organization Name & Icon Row */}
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <h2 className="flex-1 text-lg sm:text-xl font-medium text-[var(--color-brand-accent)] leading-tight line-clamp-2">
            {data.org || "Unknown Organization"}
          </h2>

          {/* Organization Icon */}
          {orgIconPath && !iconError && (
            <div className="flex-shrink-0 max-w-[80px] sm:max-w-[100px] self-center bg-white rounded-md p-1 flex items-center justify-center">
              <img
                src={orgIconPath}
                alt={`${data.org} logo`}
                className="w-auto max-h-8 sm:max-h-10 object-contain opacity-90 hover:opacity-100 transition-opacity"
                onError={() => setIconError(true)}
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--color-brand-bg)] text-[var(--color-brand-text)] rounded-md text-xs font-medium min-w-0 max-w-[160px]" title={data.fullname || "Anonymous"}>
            <FontAwesomeIcon icon={faUser} className="text-[10px] text-[var(--color-brand-muted)] flex-shrink-0" />
            <span className="truncate">{data.fullname || "Anonymous"}</span>
          </span>
          {data.previous_no_of_prs_in_org && data.previous_no_of_prs_in_org !== "0" && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--color-brand-bg)] text-[var(--color-brand-muted)] rounded-md text-xs font-medium flex-shrink-0">
              <FontAwesomeIcon icon={faCodeBranch} className="text-[10px]" />
              <span className="hidden sm:inline">{data.previous_no_of_prs_in_org} {data.previous_no_of_prs_in_org === "1" ? "PR" : "PRs"}</span>
              <span className="sm:hidden">{data.previous_no_of_prs_in_org}</span>
            </span>
          )}
          {data.pdf_filename && (
            <a 
              href={`/pdfs/${data.pdf_filename}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-[#A8C7FA]/10 text-[#A8C7FA] hover:bg-[#A8C7FA]/20 text-xs font-medium transition-colors flex-shrink-0 ml-auto"
            >
              <FontAwesomeIcon icon={faFilePdf} className="text-xs" />
              <span className="hidden sm:inline">Proposal</span>
              <span className="sm:hidden">PDF</span>
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-4">
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
      <footer className="mt-auto px-4 sm:px-5 py-3 sm:py-4 border-t border-[var(--color-brand-border)] bg-[var(--color-brand-bg)]/50">
        <div className="flex items-center gap-2 flex-wrap">
          {socialLinks.length > 0 ? (
            socialLinks.map((social) => {
              const Icon = socialIconMap[social.key];
              const isUrl = social.link.startsWith('http') || social.link.startsWith('mailto');
              
              const iconButton = (
                <span
                  key={social.key}
                  className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] flex items-center justify-center text-[var(--color-brand-muted)] hover:text-[var(--color-brand-accent)] hover:border-[var(--color-brand-accent)]/50 transition-all"
                  title={isUrl ? social.key : `${social.key}: ${social.link}`}
                >
                  <FontAwesomeIcon icon={Icon} className="text-sm sm:text-xs" />
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
