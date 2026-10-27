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
      description: 'Direct syllabus and slide sync from your university Canvas modules.',
      icon: GraduationCap,
    },
    {
      name: 'Blackboard Learn',
      category: 'Course Portal',
      description: 'One-click import of course announcements, assignments, and slide packages.',
      icon: Layers,
    },
    {
      name: 'Google Drive',
      category: 'Cloud Storage',
      description: 'Live sync with lecture folders, shared study docs, and textbook chapters.',
      icon: FolderSync,
    },
    {
      name: 'Notion & Obsidian',
      category: 'Knowledge Base',
      description: 'Export structured question banks and Markdown rationale summaries directly to your vault.',
      icon: FileCode,
    },
    {
      name: 'Anki Pro & Quizlet',
      category: 'Spaced Flashcards',
      description: 'Export AI-generated distractor decks with embedded explanations in Anki format.',
      icon: Sparkles,
    },
    {
      name: 'PDF, PPTX & Word',
      category: 'Document Formats',
      description: 'Native parsing of slides, speaker notes, textbook PDFs, and handwritten notes.',
      icon: FileText,
    },
    {
      name: 'Zoom & Transcripts',
      category: 'Recorded Lectures',
      description: 'Ingest raw lecture audio transcripts and convert verbal emphasis into test questions.',
      icon: Share2,
    },
    {
      name: 'LTI & Custom Webhooks',
      category: 'Developer API',
      description: 'Connect Somma mock exam telemetry to custom dashboards and study group workflows.',
      icon: Workflow,
    },
  ];

  return (
    <section id="integrations" className="py-24 border-t border-border bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            ECOSYSTEM COMPATIBILITY
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-foreground">
            Works seamlessly with your study tech stack
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Connect Somma directly with your university portal, note taking apps, cloud drives, and spaced repetition tools.
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
