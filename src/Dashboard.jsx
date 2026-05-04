import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { ProposalCard } from './components/ProposalCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faFilter,
  faBuilding,
  faGraduationCap,
  faTimes,
  faBars,
  faChartBar,
  faSort,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

// Responsive grid - 1 col mobile, 2 col tablet, 3 col desktop
function CardGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item, idx) => (
        <ProposalCard key={idx} data={item} />
      ))}
    </div>
  )
}

export function Dashboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(256)
  const [isResizing, setIsResizing] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('All')
  const [selectedGsocYear, setSelectedGsocYear] = useState('All')
  const [selectedCollege, setSelectedCollege] = useState('All')
  const [minPRs, setMinPRs] = useState(0)
  const [sortBy, setSortBy] = useState('org')
  const [sortOrder, setSortOrder] = useState('asc')
  const searchInputRef = useRef(null)

  useEffect(() => {
    fetch('/combined_metadata.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((jsonData) => {
        setData(jsonData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleResizeStart = useCallback(() => {
    setIsResizing(true)
  }, [])

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleResize = useCallback((e) => {
    if (isResizing) {
      const newWidth = Math.max(200, Math.min(400, e.clientX))
      setSidebarWidth(newWidth)
    }
  }, [isResizing])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize)
      window.addEventListener('mouseup', handleResizeEnd)
      return () => {
        window.removeEventListener('mousemove', handleResize)
        window.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, handleResize, handleResizeEnd])

  const filterOptions = useMemo(() => {
    const orgs = new Set()
    const gsocYears = new Set()
    const colleges = new Set()

    data.forEach((item) => {
      if (item.org) orgs.add(item.org)
      if (item.pdf_filename) {
        const match = item.pdf_filename.match(/\b(20\d{2})\b/)
        if (match) {
          gsocYears.add(parseInt(match[1]))
        }
      }
      if (item.college) colleges.add(item.college)
    })

    return {
      orgs: ['All', ...Array.from(orgs).sort()],
      gsocYears: ['All', ...Array.from(gsocYears).sort((a, b) => b - a).map(String)],
      colleges: ['All', ...Array.from(colleges).sort()]
    }
  }, [data])

  const filteredData = useMemo(() => {
    let result = data.filter((item) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm ||
        item.fullname?.toLowerCase().includes(searchLower) ||
        item.org?.toLowerCase().includes(searchLower) ||
        item.college?.toLowerCase().includes(searchLower) ||
        item.short_desc_about_contributor_40_words?.toLowerCase().includes(searchLower)

      const matchesOrg = selectedOrg === 'All' || item.org === selectedOrg
      const matchesGsocYear = selectedGsocYear === 'All' || (item.pdf_filename && item.pdf_filename.includes(selectedGsocYear))
      const matchesCollege = selectedCollege === 'All' || item.college === selectedCollege
      const matchesPRs = minPRs === 0 || parseInt(item.previous_no_of_prs_in_org || 0) >= minPRs

      return matchesSearch && matchesOrg && matchesGsocYear && matchesCollege && matchesPRs
    })

    return result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = (a.fullname || '').localeCompare(b.fullname || '')
          break
        case 'org':
          comparison = (a.org || '').localeCompare(b.org || '')
          break
        case 'year':
          comparison = (parseInt(a.year_of_graduation) || 0) - (parseInt(b.year_of_graduation) || 0)
          break
        case 'prs':
          comparison = (parseInt(a.previous_no_of_prs_in_org) || 0) - (parseInt(b.previous_no_of_prs_in_org) || 0)
          break
        default:
          comparison = 0
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [data, searchTerm, selectedOrg, selectedGsocYear, selectedCollege, minPRs, sortBy, sortOrder])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedOrg !== 'All') count++
    if (selectedGsocYear !== 'All') count++
    if (selectedCollege !== 'All') count++
    if (minPRs > 0) count++
    return count
  }, [selectedOrg, selectedGsocYear, selectedCollege, minPRs])

  const clearFilters = useCallback(() => {
    setSelectedOrg('All')
    setSelectedGsocYear('All')
    setSelectedCollege('All')
    setMinPRs(0)
    setSearchTerm('')
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-brand-bg)]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[var(--color-brand-border)]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-brand-accent)] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-[var(--color-brand-muted)] font-[var(--font-sans)] tracking-widest uppercase text-sm animate-pulse">
            Loading {data.length > 0 ? data.length : ''} Proposals
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-950/20 text-red-400 p-6 text-center">
        <p>Error loading dashboard data: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] text-[var(--color-brand-text)] font-[var(--font-sans)] flex">
      {/* Sidebar Filters */}
      <aside
        className={`
          fixed lg:sticky lg:top-0 z-40 h-screen bg-[var(--color-brand-surface)] border-r border-[var(--color-brand-border)]
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col max-w-[85vw] lg:max-w-none
        `}
        style={{ width: sidebarWidth }}
      >
        {/* Mobile Sidebar Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--color-brand-border)]">
          <span className="font-medium text-[var(--color-brand-text)]">Filters & Search</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-brand-bg)] text-[var(--color-brand-muted)] transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Resize Handle */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-[var(--color-brand-accent)]/30 transition-colors z-50"
          onMouseDown={handleResizeStart}
          title="Drag to resize"
        />

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Sort */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-text)]">
              <FontAwesomeIcon icon={faSort} className="text-[var(--color-brand-accent)]" />
              Sort By
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] rounded-lg py-1.5 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:border-transparent appearance-none cursor-pointer text-sm text-[var(--color-brand-text)]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name" className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">Contributor Name</option>
                <option value="org" className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">Organization</option>
                <option value="year" className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">Graduation Year</option>
                <option value="prs" className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">Number of PRs</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--color-brand-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder('asc')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  sortOrder === 'asc'
                    ? 'bg-[var(--color-brand-accent)] text-black'
                    : 'bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)]'
                }`}
              >
                Ascending
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  sortOrder === 'desc'
                    ? 'bg-[var(--color-brand-accent)] text-black'
                    : 'bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)]'
                }`}
              >
                Descending
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-text)]">
              <FontAwesomeIcon icon={faSearch} className="text-[var(--color-brand-accent)]" />
              Search
              <span className="hidden lg:block ml-auto text-[10px] text-[var(--color-brand-muted)] bg-[var(--color-brand-bg)] px-1.5 py-0.5 rounded border border-[var(--color-brand-border)]">
                ⌘K
              </span>
            </label>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Name, org, college..."
              className="w-full bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:border-transparent transition-all text-sm text-[var(--color-brand-text)] placeholder:text-[var(--color-brand-muted)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-text)]">
              <FontAwesomeIcon icon={faBuilding} className="text-[var(--color-brand-accent)]" />
              Organization
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] rounded-lg py-1.5 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:border-transparent appearance-none cursor-pointer text-sm text-[var(--color-brand-text)]"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
              >
                {filterOptions.orgs.map((org) => (
                  <option key={org} value={org} className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">{org}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--color-brand-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* GSoC Year */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-text)]">
              <FontAwesomeIcon icon={faGraduationCap} className="text-[var(--color-brand-accent)]" />
              GSoC Year
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] rounded-lg py-1.5 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:border-transparent appearance-none cursor-pointer text-sm text-[var(--color-brand-text)]"
                value={selectedGsocYear}
                onChange={(e) => setSelectedGsocYear(e.target.value)}
              >
                {filterOptions.gsocYears.map((year) => (
                  <option key={year} value={year} className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">{year}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--color-brand-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* College */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-text)]">
              <FontAwesomeIcon icon={faBuilding} className="text-[var(--color-brand-accent)]" />
              College
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] rounded-lg py-1.5 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:border-transparent appearance-none cursor-pointer text-sm text-[var(--color-brand-text)]"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
              >
                {filterOptions.colleges.map((college) => (
                  <option key={college} value={college} className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">
                    {college.length > 40 ? college.slice(0, 40) + '...' : college}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--color-brand-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* PR Count */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-text)]">
              <FontAwesomeIcon icon={faChartBar} className="text-[var(--color-brand-accent)]" />
              Minimum PRs: {minPRs}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={minPRs}
              onChange={(e) => setMinPRs(parseInt(e.target.value))}
              className="w-full h-2 bg-[var(--color-brand-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-accent)]"
            />
            <div className="flex justify-between text-xs text-[var(--color-brand-muted)]">
              <span>0</span>
              <span>25</span>
              <span>50+</span>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <div className="p-4 border-t border-[var(--color-brand-border)]">
            <button
              onClick={clearFilters}
              className="w-full py-1.5 px-4 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 border border-red-900/30 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faTimes} />
              Clear All Filters
            </button>
          </div>
        )}

        {/* Sidebar Footer with Logo and Credits */}
        <div className="p-4 border-t border-[var(--color-brand-border)] mt-auto">
          <div className="flex flex-col items-center gap-3">
            <img
              src="/GSoC-icon.svg"
              alt="GSoC Logo"
              className="w-16 h-16 opacity-90 hover:opacity-100 transition-opacity"
            />
            <a
              href="https://github.com/vee1e"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-brand-muted)] hover:text-[var(--color-brand-accent)] transition-colors"
            >
              built by Lakshit Verma
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-[var(--color-brand-surface)] px-4 sm:px-6 lg:px-10 py-4 sm:py-5 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--color-brand-bg)] text-[var(--color-brand-text)] transition-colors -ml-2"
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </button>
            <h1 className="text-xl lg:text-2xl font-medium tracking-tight whitespace-nowrap text-[var(--color-brand-text)]">
              GSoC Proposals
            </h1>
            <span className="w-px h-5 bg-[var(--color-brand-border)] hidden sm:block"></span>
            <p className="text-[var(--color-brand-muted)] text-sm hidden lg:block whitespace-nowrap">
              Browse accepted GSoC proposals with contributor metadata
            </p>
            <button
              onClick={() => setCreditsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)]/10 rounded-full transition-colors ml-auto lg:ml-4"
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <span className="hidden sm:inline">Credits</span>
            </button>
          </div>
        </header>

        {/* Results Bar */}
        <div className="px-4 sm:px-6 lg:px-10 py-3 bg-[var(--color-brand-surface)] border-b border-[var(--color-brand-border)]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--color-brand-muted)]">
              Showing <span className="font-medium text-[var(--color-brand-text)]">{filteredData.length}</span> of {data.length} proposals
              {activeFilterCount > 0 && (
                <span className="ml-2 text-[var(--color-brand-accent)]">({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)</span>
              )}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-24 px-6 border border-dashed border-[var(--color-brand-border)] rounded-2xl bg-[var(--color-brand-surface)]/50">
              <h3 className="text-2xl font-[var(--font-serif)] font-bold text-[var(--color-brand-text)] mb-2">No results found</h3>
              <p className="text-[var(--color-brand-muted)]">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <CardGrid items={filteredData} />
          )}
        </div>

        {/* Credits Modal */}
        {creditsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80" onClick={() => setCreditsOpen(false)} />
            <div className="relative bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] rounded-xl max-w-lg w-full p-6 shadow-2xl">
              <button
                onClick={() => setCreditsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h3 className="text-xl font-[var(--font-serif)] font-bold text-[var(--color-brand-text)] mb-6">Credits & Sources</h3>
              <div className="space-y-4 text-sm text-[var(--color-brand-muted)]">
                <p>Special thanks to the following sources for their contributions to this archive:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><a href="https://blog.sdslabs.co/gsoc/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-accent)] hover:underline">SDSLabs, IIT Roorkee</a></li>
                  <li><a href="https://github.com/COPS-IITBHU/GSoC-Accepted-Proposals" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-accent)] hover:underline">COPS, IIT BHU</a></li>
                  <li><a href="https://github.com/OpenLake/GSoC_Proposals" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-accent)] hover:underline">OpenLake, IIT Bhilai</a></li>
                  <li><a href="https://github.com/JatsuAkaYashvant/Accepted-proposals" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-accent)] hover:underline">Yashvant Singh</a></li>
                  <li><a href="https://github.com/Google-Summer-of-Code-Archive/gsoc-proposals-archive" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-accent)] hover:underline">GSoC Proposals Archive</a></li>
                  <li><a href="https://github.com/SammanSarkar/GSoC_archive_2025" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-accent)] hover:underline">Samman Sarkar&apos;s GSoC 2025 Archive</a></li>
                  <li><a href="https://github.com/satwiksps/GSoC_archive_2026" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-accent)] hover:underline">Satwik Sai Prakash Sahoo&apos;s GSoC 2026 Archive</a></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
