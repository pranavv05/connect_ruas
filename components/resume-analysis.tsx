"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"

// Define the interface for the suggestion structure coming from the API
export interface SuggestionItem {
  original: string;
  improved: string;
  reason: string;
}

export interface SuggestionCategory {
  category: string;
  severity: 'high' | 'medium' | 'low';
  items: SuggestionItem[];
}

interface ResumeAnalysisProps {
    analysisData?: SuggestionCategory[]; // Added '?' and default in function
    mockScore: number;
}

// Helper to map severity to icons/colors
const severityMap: Record<string, { icon: any, color: string, bgColor: string, borderColor: string }> = {
    high: { icon: AlertCircle, color: "text-destructive", bgColor: "bg-destructive/10", borderColor: "border-destructive/20" },
    medium: { icon: Lightbulb, color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning/20" },
    low: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10", borderColor: "border-success/20" },
};

export interface AiTip {
  title: string;
  description: string;
}

// FIX: Set analysisData = [] as the default value in the function signature
export function ResumeAnalysis({ analysisData = [], mockScore }: ResumeAnalysisProps) {
  
  // This line is now safe because analysisData is guaranteed to be an array.
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    analysisData.length > 0 ? [analysisData[0].category] : []
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const totalSuggestions = analysisData.reduce((acc, cat) => acc + cat.items.length, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Complete</h3>
            <p className="text-sm text-muted-foreground mb-3">
              We found {totalSuggestions} suggestions to improve your resume. Your score is currently **{mockScore}/100**.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions by Category */}
      <div className="space-y-4">
        {analysisData.map((category, categoryIndex) => {
          const { icon: Icon, color, bgColor, borderColor } = severityMap[category.severity] || severityMap.medium;
          const isExpanded = expandedCategories.includes(category.category)

          return (
            <div
              key={`${category.category}-${categoryIndex}`}
              className={`bg-card border ${borderColor} rounded-lg overflow-hidden`}
            >
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-semibold text-foreground">{category.category}</h4>
                    <p className="text-sm text-muted-foreground">{category.items.length} suggestions</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4 space-y-4">
                  {category.items.map((item, index) => {
                    const key = `${category.category}-${categoryIndex}-${index}`;

                    return (
                      <div key={key} className="bg-secondary rounded-lg p-4">
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Current:</p>
                          <p className="text-sm text-foreground bg-muted/50 rounded px-3 py-2">{item.original}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-success mb-2">Suggested:</p>
                          <p className="text-sm text-foreground bg-success/5 border border-success/20 rounded px-3 py-2">
                            {item.improved}
                          </p>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground italic">{item.reason}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}