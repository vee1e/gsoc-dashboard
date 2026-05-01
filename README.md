# GSoC Proposals Dashboard

<img width="1439" height="904" alt="image" src="https://github.com/user-attachments/assets/a12f0a3a-f427-4a2c-9922-df146afb61a7" />


A sleek, dark-themed dashboard for exploring Google Summer of Code (GSoC) accepted proposals. Browse contributor profiles, filter by organization and year, view proposal PDFs, and discover inspiring open-source contributors.

## Features

- Browse proposals in a responsive 3-column card layout
- Find contributors by name, organization, college, or description (with Cmd+K shortcut)
- Filter by organization, graduation year, college, and minimum PR count
- Sort by contributor name, organization, graduation year, or number of PRs
- One-click access to view full proposal PDFs
- Quick links to GitHub, LinkedIn, Twitter, and other platforms

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Bun](https://bun.sh/) (preferred) or npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/vee1e/gsoc-dashboard.git
cd gsoc-dashboard

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
bun run build
```

Static files will be generated in the `dist/` directory.

## Data Format

The dashboard consumes a CSV file (`public/combined_metadata.csv`) with the following columns:

| Column | Description |
|--------|-------------|
| `pdf_filename` | Name of the PDF file in `public/pdfs/` |
| `org` | GSoC mentoring organization |
| `fullname` | Contributor's full name |
| `college` | University/College name |
| `year_of_study` | Current year of study |
| `year_of_graduation` | Expected graduation year |
| `github`, `linkedin`, `twitter` | Social profile links |
| `email`, `gmail` | Contact email addresses |
| `website`, `blog`, `portfolio` | Personal websites |
| `stackoverflow`, `gitlab`, `medium`, `dev_to`, `reddit`, `discord` | Other platforms |
| `previous_no_of_prs_in_org` | Number of prior PRs to the organization |
| `short_desc_about_contributor_40_words` | Brief contributor bio |
| `proposal_short_desc_40_words` | Proposal summary |

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI library with hooks for state management |
| [Vite 8](https://vitejs.dev) | Fast build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS framework |
| [PapaParse](https://www.papaparse.com) | CSV parsing in the browser |
| [FontAwesome](https://fontawesome.com) | Icons for UI elements |
| [react-window](https://github.com/bvaughn/react-window) | (Optional) Virtualization for large lists |

## Design System

The dashboard uses a sophisticated dark theme:

- **Accent Color**: White (`#ffffff`)
- **Background**: Pure Black (`#000000`)
- **Text**: Silver/Gray (`#c0c0c0`)
- **Muted Text**: Gray (`#808080`)
- **Borders**: Dark Gray (`#333333`)
- **Typography**:
  - Headlines: *Playfair Display* (Serif)
  - Body: *DM Sans* (Sans-serif)

## Credits

This project aggregates data from multiple sources. Special thanks to:

- [SDSLabs, IIT Roorkee](https://blog.sdslabs.co/gsoc/)
- [COPS, IIT BHU](https://github.com/COPS-IITBHU/GSoC-Accepted-Proposals)
- [OpenLake, IIT Bhilai](https://github.com/OpenLake/GSoC_Proposals)
- [Yashvant Singh](https://github.com/JatsuAkaYashvant/Accepted-proposals)
- [GSoC Proposals Archive](https://github.com/Google-Summer-of-Code-Archive/gsoc-proposals-archive)
- [Samman Sarkar's GSoC 2025 Archive](https://github.com/SammanSarkar/GSoC_archive_2025)

## License

[MIT](LICENSE) — Feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! If you'd like to add more proposals or improve the dashboard:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<p align="center">
  Built with ❤️ for the open-source and the GSoC community
</p>
