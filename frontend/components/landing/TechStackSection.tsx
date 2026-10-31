import React from 'react';
import {
  FileText,
  FileCode,
  FolderSync,
  Layers,
  GraduationCap,
  Sparkles,
  Share2,
  Workflow,
} from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const integrations = [
    {
      name: 'Canvas LMS',
      category: 'Course Portal',
      description: 'Import syllabi, lecture decks, and reading lists from your Canvas courses.',
      icon: GraduationCap,
    },
    {
      name: 'Blackboard Learn',
      category: 'Course Portal',
      description: 'Import announcements and slide packages directly from Blackboard.',
      icon: Layers,
    },
    {
      name: 'Google Drive',
      category: 'Cloud Storage',
      description: 'Sync lecture folders, shared study guides, and textbook chapters.',
      icon: FolderSync,
    },
    {
      name: 'Notion & Obsidian',
      category: 'Knowledge Base',
      description: 'Export generated practice questions and summaries directly to your notes.',
      icon: FileCode,
    },
    {
      name: 'Anki & Quizlet',
      category: 'Spaced Flashcards',
      description: 'Export tricky questions with explanations directly into Anki flashcard decks.',
      icon: Sparkles,
    },
    {
      name: 'PDF, Slides & Word',
      category: 'Document Formats',
      description: 'Read text from PowerPoint slides, textbook PDFs, Word documents, and typed notes.',
      icon: FileText,
    },
    {
      name: 'Lecture Transcripts',
      category: 'Recorded Lectures',
      description: 'Paste recorded lecture transcripts and create review questions on key spoken points.',
      icon: Share2,
    },
    {
      name: 'Export & APIs',
      category: 'Study Groups',
      description: 'Download question banks as JSON or CSV to share with your study group.',
      icon: Workflow,
    },
  ];

  return (
    <section id="integrations" className="py-24 border-t border-border bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            INTEGRATIONS
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-foreground">
            Works with your existing study tools
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Import slides and notes from your university portal, cloud storage, or note-taking apps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {integrations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
