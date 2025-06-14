
import { create } from 'zustand';

// Document Upload States
export type DocumentUploadState = 
  | 'idle' | 'dragging' | 'selected' | 'uploading' | 'success' | 'error' 
  | 'multiple-pending' | 'remove-hovered' | 'preview-expanded' 
  | 'verification-requested' | 'verification-progress' | 'verified-valid' 
  | 'verified-rejected' | 'edit-metadata' | 'ocr-extraction';

// Application Progress States
export type ApplicationProgressState = 
  | 'empty' | 'fetching' | 'in-review' | 'approved' | 'rejected' 
  | 'resubmit-prompt' | 'hover-actions' | 'timeline-open' | 'searching' 
  | 'sort-active' | 'pagination' | 'bulk-mode' | 'filter-applied' 
  | 'download-initiated' | 'download-complete';

// Language States
export type LanguageState = 
  | 'closed' | 'opened' | 'hovered' | 'selected' | 'changed' 
  | 'loading' | 'persisted' | 'auto-detect' | 'error' | 'not-translated' 
  | 'manual-override' | 'rtl-mode' | 'voice-synced' | 'agent-localized' 
  | 'notifications-translated';

// Notification States
export type NotificationState = 
  | 'idle' | 'sms-enabled' | 'push-enabled' | 'email-enabled' 
  | 'all-disabled' | 'saved' | 'preview-sent' | 'unverified' 
  | 'realtime-banner' | 'permission-prompt' | 'permission-denied' 
  | 'custom-time' | 'frequency-adjusted' | 'quiet-hours' | 'history-view';

// Blockchain States
export type BlockchainState = 
  | 'idle' | 'connect-prompt' | 'connecting' | 'connected' 
  | 'hashing-pending' | 'hashed' | 'upload-initiated' | 'confirmation-waiting' 
  | 'success' | 'verification-generated' | 'failed' | 'retry-option' 
  | 'audit-expanded' | 'user-verifying' | 'rehash-prompt';

// Community States
export type CommunityState = 
  | 'landing' | 'not-logged' | 'new-post-modal' | 'draft-saved' 
  | 'submitted' | 'error' | 'detail-view' | 'comment-added' 
  | 'toxicity-filtered' | 'abuse-flagged' | 'admin-view' 
  | 'reddit-fetched' | 'sync-reddit' | 'post-deleted' | 'platform-toggle';

// AI Governance States
export type AIGovernanceState = 
  | 'logged' | 'tooltip-visible' | 'explanation-open' | 'rejection-prompt' 
  | 'feedback-expanded' | 'panel-settings' | 'transparency-on' 
  | 'toxicity-explanation' | 'consent-prompt' | 'consent-denied' 
  | 'bias-detected' | 'privacy-notice' | 'audit-log' | 'debug-mode' | 'version-displayed';

// Performance States
export type PerformanceState = 
  | 'initial-load' | 'lazy-loading' | 'preloading' | 'api-spinner' 
  | 'timeout' | 'offline-banner' | 'low-bandwidth' | 'retry-upload' 
  | 'bulk-throttling' | 'compression' | 'cache-detected' | 'cdn-fallback' 
  | 'lazy-load-fonts' | 'clear-cache' | 'sync-completed';

// Agent States
export type AgentState = {
  voice: 'idle' | 'detected' | 'initiated' | 'generating' | 'playing' | 'paused' | 'complete' | 'mismatch' | 'manual' | 'error' | 'muted' | 'accessibility' | 'feedback' | 'retry' | 'silent';
  document: 'idle' | 'triggered' | 'extracted' | 'validating' | 'success' | 'failed' | 'manual-review' | 'ocr-error' | 'confidence' | 'invalid-fields' | 'blurry' | 'page-limit' | 'preview' | 'explanation' | 'retry';
  progress: 'idle' | 'activated' | 'submitted' | 'review' | 'forwarded' | 'rejected' | 'approved' | 'resubmission' | 'timeline' | 'incomplete' | 'unavailable' | 'override' | 'polling' | 'low-network' | 'archived';
  language: 'default' | 'triggered' | 'progress' | 'successful' | 'error' | 'auto-detected' | 'manual' | 'partial' | 'preview' | 'history' | 'unsupported' | 'dynamic' | 'rtl' | 'font-adjusted' | 'feedback';
  blockchain: 'idle' | 'activated' | 'generated' | 'connected' | 'started' | 'pending' | 'success' | 'failed' | 'retry' | 'exists' | 'verifies' | 'passed' | 'tampered' | 'proof-generated' | 'offline';
  notification: 'pending' | 'sent' | 'failed' | 'disabled' | 'prompted' | 'delivered' | 'confirmed' | 'banner' | 'controlled' | 'history' | 'quiet' | 'urgent' | 'test' | 'revoked' | 'broadcast';
  community: 'idle' | 'fetching' | 'loaded' | 'filtered' | 'posted' | 'flagged' | 'removed' | 'triggered' | 'shown' | 'adjusted' | 'failed' | 'approved' | 'conflicted' | 'toggled' | 'synced';
};

interface UIState {
  // Document Upload
  documentUpload: DocumentUploadState;
  uploadProgress: number;
  uploadedFiles: File[];
  dragActive: boolean;
  
  // Application Progress
  applicationProgress: ApplicationProgressState;
  applications: any[];
  selectedApplication: string | null;
  
  // Language
  language: LanguageState;
  currentLanguage: string;
  
  // Notifications
  notification: NotificationState;
  notificationPrefs: {
    sms: boolean;
    push: boolean;
    email: boolean;
  };
  
  // Blockchain
  blockchain: BlockchainState;
  walletConnected: boolean;
  documentHash: string | null;
  
  // Community
  community: CommunityState;
  posts: any[];
  
  // AI Governance
  aiGovernance: AIGovernanceState;
  
  // Performance
  performance: PerformanceState;
  
  // Agents
  agents: AgentState;
  
  // Actions
  setDocumentUploadState: (state: DocumentUploadState) => void;
  setApplicationProgressState: (state: ApplicationProgressState) => void;
  setLanguageState: (state: LanguageState) => void;
  setNotificationState: (state: NotificationState) => void;
  setBlockchainState: (state: BlockchainState) => void;
  setCommunityState: (state: CommunityState) => void;
  setAIGovernanceState: (state: AIGovernanceState) => void;
  setPerformanceState: (state: PerformanceState) => void;
  setAgentState: (agent: keyof AgentState, state: string) => void;
}

export const useUIState = create<UIState>((set) => ({
  // Initial States
  documentUpload: 'idle',
  uploadProgress: 0,
  uploadedFiles: [],
  dragActive: false,
  
  applicationProgress: 'empty',
  applications: [],
  selectedApplication: null,
  
  language: 'closed',
  currentLanguage: 'en',
  
  notification: 'idle',
  notificationPrefs: {
    sms: false,
    push: false,
    email: true,
  },
  
  blockchain: 'idle',
  walletConnected: false,
  documentHash: null,
  
  community: 'landing',
  posts: [],
  
  aiGovernance: 'logged',
  
  performance: 'initial-load',
  
  agents: {
    voice: 'idle',
    document: 'idle',
    progress: 'idle',
    language: 'default',
    blockchain: 'idle',
    notification: 'pending',
    community: 'idle',
  },
  
  // Actions
  setDocumentUploadState: (state) => set({ documentUpload: state }),
  setApplicationProgressState: (state) => set({ applicationProgress: state }),
  setLanguageState: (state) => set({ language: state }),
  setNotificationState: (state) => set({ notification: state }),
  setBlockchainState: (state) => set({ blockchain: state }),
  setCommunityState: (state) => set({ community: state }),
  setAIGovernanceState: (state) => set({ aiGovernance: state }),
  setPerformanceState: (state) => set({ performance: state }),
  setAgentState: (agent, state) => set((prev) => ({
    agents: { ...prev.agents, [agent]: state }
  })),
}));
