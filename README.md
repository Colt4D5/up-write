# WriterBuddy

A comprehensive writing application for authors to organize and write books with AI-powered writing assistance.

## Features

### 📖 Project Organization
- **Multi-project management**: Organize multiple writing projects
- **Hierarchical notebooks**: Structure your work with chapters, characters, plot notes, research, and general notes
- **Document management**: Create and organize documents within notebooks
- **Progress tracking**: Monitor word counts and writing goals

### 🤖 AI Writing Assistant
- **Real-time analysis**: Get suggestions as you write
- **Writing improvement**: Identifies passive voice, weak sentence structure, ambiguity, and clarity issues
- **Style suggestions**: Recommendations for better pacing, flow, and readability
- **Severity levels**: Low, medium, and high priority suggestions
- **Accept/dismiss functionality**: Choose which suggestions to apply

### ✍️ Rich Text Editor
- **WYSIWYG editing**: Rich text editor with formatting tools
- **Real-time word counting**: Track your progress as you write
- **Auto-save functionality**: Never lose your work
- **Distraction-free writing**: Clean, focused writing environment

### 📊 Analytics & Statistics
- **Writing statistics**: Track daily word counts and writing time
- **Progress visualization**: See your writing habits and productivity
- **Goal tracking**: Set and monitor word count targets
- **Selective word counting**: Choose which notebooks contribute to your project's word count (e.g., only chapters, not character notes or research)

### 👥 Character Development
- **Character profiles**: Detailed character sheets with appearance, personality, backstory
- **Relationship tracking**: Map character relationships and interactions
- **Character notes**: Keep track of character development throughout your story

## Tech Stack

- **Frontend**: SvelteKit 5 with TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Drizzle ORM
- **Authentication**: Lucia Auth
- **Rich Text Editor**: TipTap
- **AI Integration**: OpenAI GPT-4
- **Icons**: Lucide Svelte

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone and setup the project**:
   ```bash
   cd writer-buddy
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY="your-openai-api-key-here"
   ```

3. **Initialize the database**:
   ```bash
   pnpm db:push --force
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### First Time Setup

1. **Create an account**: Navigate to `/login` and create a new account
2. **Create your first project**: Click "New Project" and fill in the details
3. **Start writing**: Select a document from the sidebar and begin writing
4. **Get AI suggestions**: The AI assistant will automatically analyze your text and provide suggestions

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── RichTextEditor.svelte    # Main text editor
│   │   └── AiSuggestions.svelte     # AI suggestions panel
│   ├── server/
│   │   ├── db/
│   │   │   ├── index.ts             # Database connection
│   │   │   └── schema.ts            # Database schema
│   │   ├── ai.ts                    # AI writing service
│   │   ├── auth.ts                  # Authentication setup
│   │   └── services.ts              # Business logic services
│   ├── types.ts                     # TypeScript type definitions
│   └── utils.ts                     # Utility functions
├── routes/
│   ├── dashboard/                   # Main dashboard
│   ├── projects/                    # Project management
│   │   ├── [id]/                   # Individual project view
│   │   └── new/                    # Create new project
│   ├── api/
│   │   └── ai/
│   │       └── analyze/            # AI analysis endpoint
│   └── demo/lucia/                 # Authentication routes
└── app.html                        # Main HTML template
```

## Database Schema

The application uses SQLite with the following main tables:

- **users**: User accounts and profiles
- **projects**: Writing projects with metadata
- **notebooks**: Organizational containers (chapters, characters, etc.)
- **documents**: Individual text documents
- **characters**: Character development sheets
- **ai_suggestions**: AI-generated writing suggestions
- **writing_statistics**: Progress tracking and analytics

## Features in Detail

### AI Writing Assistant

The AI assistant uses OpenAI's GPT-4 to analyze your writing and provide suggestions for:

- **Grammar and spelling**: Basic error detection and correction
- **Passive voice**: Identifies passive voice and suggests active alternatives
- **Sentence structure**: Flags weak or unclear sentence construction
- **Clarity**: Highlights ambiguous phrasing or word choices
- **Style**: Suggests improvements for better flow and readability
- **Pacing**: Identifies pacing issues in narrative writing

### Project Organization

Projects are organized hierarchically:

- **Project** (top level)
  - **Notebooks** (categories like Chapters, Characters, Plot, Research, Notes)
    - **Documents** (individual text files)

This structure allows you to keep all aspects of your writing project organized and easily accessible.

#### Word Count Contribution

Each notebook can be configured to contribute (or not contribute) to the project's total word count:

- **Contributing notebooks** (marked with 🎯): Words from documents in these notebooks count toward your project's progress
- **Non-contributing notebooks** (marked with #): Used for notes, research, character development, etc. that don't count toward your writing goals
- **Default behavior**: New projects have "Chapters" contributing to word count, while "Characters", "Plot & Structure", "Research & Notes", and "General Notes" do not
- **Customizable**: Click the icon next to any notebook name to toggle whether it contributes to your word count

### Rich Text Editor

Built on TipTap, the editor provides:

- Bold, italic, underline formatting
- Bullet and numbered lists
- Blockquotes for emphasis
- Undo/redo functionality
- Live word and character counts
- Auto-saving (planned feature)

## Development

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm preview`: Preview production build
- `pnpm lint`: Run ESLint
- `pnpm format`: Format code with Prettier
- `pnpm db:push`: Push database schema changes
- `pnpm db:studio`: Open Drizzle Studio for database management

### Features To Come

- Plot consistency checker
- AI-generated character wikis strictly from the writing
- Timeline continuity/generator
- Intensity graphs

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and formatting
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue on the GitHub repository.
