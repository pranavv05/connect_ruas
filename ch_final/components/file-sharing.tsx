"use client";

import { useState, useEffect, useRef } from "react";
import { Paperclip, Download, X } from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export function FileSharing({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get file extension
  const getFileExtension = (mimeType: string, fileName: string): string => {
    // Handle common file types
    if (mimeType) {
      if (mimeType.includes('wordprocessingml')) return 'DOC';
      if (mimeType.includes('spreadsheetml')) return 'XLS';
      if (mimeType.includes('presentationml')) return 'PPT';
      if (mimeType.includes('pdf')) return 'PDF';
      if (mimeType.includes('image')) {
        // For images, try to get the specific type
        const imageType = mimeType.split('/').pop()?.toUpperCase();
        return imageType && imageType.length <= 4 ? imageType : 'IMG';
      }
      if (mimeType.includes('zip')) return 'ZIP';
      if (mimeType.includes('text')) return 'TXT';
      
      // For other MIME types, try to extract the meaningful part
      const parts = mimeType.split('/');
      if (parts.length > 1) {
        const subtype = parts[1];
        // Handle vendor specific types like vnd.openxmlformats-officedocument.wordprocessingml.document
        if (subtype.startsWith('vnd.')) {
          // Extract the meaningful part after the last dot
          const subparts = subtype.split('.');
          const lastPart = subparts[subparts.length - 1].toUpperCase();
          return lastPart.length <= 4 ? lastPart : lastPart.substring(0, 4);
        }
        // For standard types, use the subtype
        const ext = subtype.split('.')[0].toUpperCase();
        return ext.length <= 4 ? ext : ext.substring(0, 4);
      }
    }
    
    // Fallback to file extension from name
    if (fileName) {
      const ext = fileName.split('.').pop()?.toUpperCase();
      if (ext && ext.length <= 4) return ext;
    }
    
    // Default fallback
    return 'FILE';
  };

  // Fetch real files from API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/files`, { 
          credentials: 'include' 
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch files');
        }
        
        const data = await res.json();
        setFiles(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        setLoading(false);
      }
    };

    if (projectId) {
      fetchFiles();
    }
  }, [projectId]);

  const triggerFileInput = (e?: React.MouseEvent | React.FormEvent | React.KeyboardEvent) => {
    // Prevent any default behavior
    if (e && 'preventDefault' in e && e.preventDefault) {
      e.preventDefault();
    }
    if (e && 'stopPropagation' in e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent any default behavior
    if (e && 'preventDefault' in e && e.preventDefault) {
      e.preventDefault();
    }
    if (e && 'stopPropagation' in e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    const file = e.target.files?.[0];
    if (file && !isUploading) {
      setIsUploading(true);
      
      try {
        // Optimistic update - add file to UI immediately
        const optimisticFile: SharedFile = {
          id: `temp-${Date.now()}`,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          type: getFileExtension(file.type, file.name),
          uploadedBy: 'You',
          uploadedAt: new Date().toISOString(),
          url: '#' // Placeholder URL
        };
        
        setFiles(prev => [optimisticFile, ...prev]);
        
        // In a real implementation, you would upload the file to storage and get a URL
        // For now, we'll just create a file entry with a placeholder URL
        const res = await fetch(`/api/projects/${projectId}/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: file.name,
            url: '#', // Placeholder URL
            size: file.size,
            type: getFileExtension(file.type, file.name),
          })
        });
        
        if (!res.ok) {
          // Remove optimistic file on error
          setFiles(prev => prev.filter(f => f.id !== optimisticFile.id));
          throw new Error('Failed to upload file');
        }
        
        const newFile = await res.json();
        // Replace optimistic file with actual file from server
        setFiles(prev => [
          newFile,
          ...prev.filter(f => f.id !== optimisticFile.id)
        ]);
      } catch (error) {
        console.error("Failed to upload file:", error);
        // Remove optimistic file on error
        setFiles(prev => prev.filter(f => !f.id.startsWith('temp-')));
        alert("Failed to upload file. Please try again.");
      } finally {
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleDeleteFile = async (fileId: string, e?: React.MouseEvent | React.FormEvent | React.KeyboardEvent) => {
    // Prevent any default behavior
    if (e && 'preventDefault' in e && e.preventDefault) {
      e.preventDefault();
    }
    if (e && 'stopPropagation' in e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    // Optimistic update - remove file from UI immediately
    const fileToDelete = files.find(file => file.id === fileId);
    if (!fileToDelete) return;
    
    setFiles(prev => prev.filter(file => file.id !== fileId));
    
    try {
      const res = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!res.ok) {
        // Restore file on error
        setFiles(prev => [fileToDelete, ...prev]);
        throw new Error('Failed to delete file');
      }
      
      // File successfully deleted, no need to do anything else
    } catch (error) {
      console.error("Failed to delete file:", error);
      // Restore file on error
      setFiles(prev => [fileToDelete, ...prev]);
      alert("Failed to delete file. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Shared Files</h3>
          <div className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            Upload
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-secondary rounded-lg p-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <div className="bg-secondary rounded-lg p-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Shared Files</h3>
        <div className="relative">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              e.stopPropagation();
              handleFileUpload(e);
            }}
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerFileInput(e);
            }}
            disabled={isUploading}
            className={`bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Paperclip className="w-4 h-4" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No files shared yet</p>
            <p className="text-sm mt-1">Upload a file to get started</p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="bg-secondary rounded-lg p-3 group relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-medium">
                  {getFileExtension(file.type, file.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Uploaded by {file.uploadedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={file.url} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(file.url, '_blank');
                    }}
                    className="w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success hover:bg-success/20 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteFile(file.id, e);
                    }}
                    className="w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
                    title="Delete"
                    disabled={file.id.startsWith('temp-')} // Disable delete for uploading files
                  >
                    {file.id.startsWith('temp-') ? (
                      <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}