import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatabaseService, DatabaseOverview, CollectionStat } from '../../core/services/database.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-db-inspector',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto animate-fadeIn pb-12">
      
      <!-- Top Title & Connection Status Banner -->
      <div class="mvgr-card p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-l-4 border-l-emerald-500">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE MONGODB DATABASE EXPLORER · UNIPULSE
          </div>
          
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Live Database Inspector
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time review of collections, peer chats, user records, and application data in MongoDB
          </p>
        </div>

        <!-- Connection Details & Fast Actions -->
        <div class="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div class="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
            <span class="text-[10px] text-slate-400 uppercase block">Host / DB</span>
            <span class="font-bold text-slate-900 dark:text-white">mongodb://localhost:27017/{{ overview()?.databaseName || 'unipulse' }}</span>
          </div>

          <div class="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
            <span class="text-[10px] text-slate-400 uppercase block">Total Live Docs</span>
            <span class="font-bold text-blue-600 dark:text-blue-400 text-sm">{{ overview()?.totalDocuments || 0 }}</span>
          </div>

          <button 
            type="button" 
            (click)="launchCompass()"
            class="mvgr-btn-secondary text-xs py-2 px-3.5"
            title="Open MongoDB Compass Desktop App">
            <span>🧭</span>
            Launch Compass GUI
          </button>
        </div>
      </div>

      <!-- Controls & Live Mode Toggle -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#10172a] border border-slate-200 dark:border-white/10 text-xs">
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            (click)="refreshData()"
            class="mvgr-btn-primary py-1.5 px-3 flex items-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Now</span>
          </button>

          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              [(ngModel)]="autoRefresh"
              (change)="toggleAutoRefresh()"
              class="rounded border-slate-300 text-blue-600 focus:ring-0">
            <span class="font-semibold text-slate-700 dark:text-slate-300">Auto-Refresh Live Feed (every 3s)</span>
            @if (autoRefresh) {
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            }
          </label>
        </div>

        <div class="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          <span>Last polled: <strong>{{ lastPolledTime | date:'mediumTime' }}</strong></span>
        </div>
      </div>

      <!-- Main Two-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left Sidebar: Collections List (4 cols) -->
        <div class="lg:col-span-4 mvgr-card p-4 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
            <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Collections ({{ overview()?.collections?.length || 0 }})
            </h3>
            <span class="text-[10px] text-slate-400 font-mono">Newest First</span>
          </div>

          <div class="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            @for (col of overview()?.collections; track col.name) {
              @let isSelected = selectedCollection() === col.name;
              <button 
                type="button" 
                (click)="selectCollection(col.name)"
                [ngClass]="isSelected 
                  ? 'bg-blue-600 text-white font-bold shadow-sm' 
                  : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'"
                class="w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs font-mono">
                
                <div class="flex items-center gap-2 truncate">
                  <span>{{ getCollectionIcon(col.name) }}</span>
                  <span class="truncate">{{ col.name }}</span>
                </div>

                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                  [ngClass]="isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400'">
                  {{ col.count }}
                </span>
              </button>
            }
          </div>
        </div>

        <!-- Right Main Panel: Documents Inspector (8 cols) -->
        <div class="lg:col-span-8 mvgr-card p-6 space-y-4">
          
          <!-- Header for active collection -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ getCollectionIcon(selectedCollection()) }}</span>
                <h2 class="text-base font-bold text-slate-900 dark:text-white font-mono">
                  Collection: {{ selectedCollection() }}
                </h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                Showing {{ documents().length }} of {{ totalDocumentsInCol() }} live records
              </p>
            </div>

            <!-- View Mode Switch & Search -->
            <div class="flex items-center gap-2">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="onSearchChange()"
                placeholder="Filter fields, ID, text..."
                class="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 font-mono w-48"
              />

              <div class="inline-flex rounded-lg bg-slate-100 dark:bg-white/[0.04] p-0.5 border border-slate-200 dark:border-white/10 text-[11px] font-mono">
                <button 
                  type="button" 
                  (click)="viewMode = 'cards'"
                  [ngClass]="viewMode === 'cards' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500'"
                  class="px-2.5 py-1 rounded transition-all">
                  Cards
                </button>
                <button 
                  type="button" 
                  (click)="viewMode = 'json'"
                  [ngClass]="viewMode === 'json' ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500'"
                  class="px-2.5 py-1 rounded transition-all">
                  JSON
                </button>
              </div>
            </div>
          </div>

          <!-- Documents List View -->
          @if (isLoadingDocs) {
            <div class="p-12 text-center text-slate-400 font-mono text-xs">
              Fetching live records from MongoDB...
            </div>
          } @else if (documents().length === 0) {
            <div class="p-12 text-center text-slate-400 font-mono text-xs space-y-2">
              <span class="text-2xl">📭</span>
              <p>No documents found in '{{ selectedCollection() }}'</p>
            </div>
          } @else {
            
            @if (viewMode === 'cards') {
              <!-- Cards View -->
              <div class="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                @for (doc of documents(); track doc._id) {
                  <div class="p-4 rounded-xl bg-slate-50/70 dark:bg-black/30 border border-slate-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-white/20 transition-all font-mono text-xs space-y-2">
                    
                    <div class="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.04] pb-2 text-[11px]">
                      <span class="text-blue-600 dark:text-blue-400 font-bold truncate">
                        _id: {{ doc._id }}
                      </span>
                      <div class="flex items-center gap-2 shrink-0">
                        @if (doc.createdAt) {
                          <span class="text-slate-400 text-[10px]">
                            {{ doc.createdAt | date:'medium' }}
                          </span>
                        }
                        <button 
                          type="button" 
                          (click)="copyDocJson(doc)"
                          class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 hover:bg-slate-300 text-slate-700 dark:text-white text-[10px]"
                          title="Copy raw JSON">
                          Copy JSON
                        </button>
                      </div>
                    </div>

                    <!-- Highlighted field previews based on collection -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      @if (doc.name) {
                        <div><span class="text-slate-400">name:</span> <strong class="text-slate-900 dark:text-white">{{ doc.name }}</strong></div>
                      }
                      @if (doc.registrationNumber) {
                        <div><span class="text-slate-400">registrationNumber:</span> <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ doc.registrationNumber }}</span></div>
                      }
                      @if (doc.email) {
                        <div><span class="text-slate-400">email:</span> <span class="text-slate-700 dark:text-slate-300">{{ doc.email }}</span></div>
                      }
                      @if (doc.title) {
                        <div class="sm:col-span-2"><span class="text-slate-400">title:</span> <strong class="text-slate-900 dark:text-white">{{ doc.title }}</strong></div>
                      }
                      @if (doc.content) {
                        <div class="sm:col-span-2 bg-white dark:bg-black/40 p-2 rounded border border-slate-200/60 dark:border-white/5">
                          <span class="text-slate-400 block text-[10px] uppercase font-bold">content / message:</span>
                          <p class="text-slate-800 dark:text-slate-200 whitespace-pre-wrap mt-0.5">{{ doc.content }}</p>
                        </div>
                      }
                      @if (doc.sender) {
                        <div><span class="text-slate-400">sender:</span> <span class="text-slate-600 dark:text-slate-300">{{ doc.sender }}</span></div>
                      }
                      @if (doc.recipient) {
                        <div><span class="text-slate-400">recipient:</span> <span class="text-slate-600 dark:text-slate-300">{{ doc.recipient }}</span></div>
                      }
                      @if (doc.status) {
                        <div><span class="text-slate-400">status:</span> <span class="px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">{{ doc.status }}</span></div>
                      }
                    </div>

                    <!-- Expandable Full JSON -->
                    <details class="text-[10px] text-slate-500 pt-1">
                      <summary class="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 select-none">View full document JSON</summary>
                      <pre class="mt-2 p-2.5 rounded-lg bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-emerald-400 overflow-x-auto text-[10px] leading-tight">{{ doc | json }}</pre>
                    </details>

                  </div>
                }
              </div>
            } @else {
              <!-- Raw JSON Tree View -->
              <div class="max-h-[600px] overflow-y-auto">
                <pre class="p-4 rounded-xl bg-slate-900 text-emerald-400 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">{{ documents() | json }}</pre>
              </div>
            }

          }

        </div>

      </div>

    </div>
  `
})
export class DbInspectorComponent implements OnInit, OnDestroy {
  private dbService = inject(DatabaseService);
  private toastService = inject(ToastService);

  overview = signal<DatabaseOverview | null>(null);
  selectedCollection = signal<string>('messages');
  documents = signal<any[]>([]);
  totalDocumentsInCol = signal<number>(0);

  isLoadingDocs = false;
  searchQuery = '';
  viewMode: 'cards' | 'json' = 'cards';
  autoRefresh = true;
  lastPolledTime = new Date();
  private pollInterval: any;

  ngOnInit(): void {
    this.refreshData();
    this.toggleAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  toggleAutoRefresh(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    if (this.autoRefresh) {
      this.pollInterval = setInterval(() => {
        this.fetchOverviewSilent();
        this.fetchDocumentsSilent(this.selectedCollection());
      }, 3000);
    }
  }

  refreshData(): void {
    this.dbService.getOverview().subscribe({
      next: (res) => {
        this.overview.set(res.data);
        this.lastPolledTime = new Date();
        if (res.data.collections.length > 0) {
          // If active collection is not in list, pick the first
          if (!this.selectedCollection() || !res.data.collections.some(c => c.name === this.selectedCollection())) {
            this.selectedCollection.set(res.data.collections[0].name);
          }
          this.loadDocuments(this.selectedCollection());
        }
      },
      error: () => this.toastService.error('Could not connect to MongoDB inspector API')
    });
  }

  private fetchOverviewSilent(): void {
    this.dbService.getOverview().subscribe({
      next: (res) => {
        this.overview.set(res.data);
        this.lastPolledTime = new Date();
      }
    });
  }

  selectCollection(name: string): void {
    this.selectedCollection.set(name);
    this.searchQuery = '';
    this.loadDocuments(name);
  }

  loadDocuments(name: string): void {
    this.isLoadingDocs = true;
    this.dbService.getDocuments(name, this.searchQuery).subscribe({
      next: (res) => {
        this.isLoadingDocs = false;
        this.documents.set(res.data.documents);
        this.totalDocumentsInCol.set(res.data.totalCount);
      },
      error: () => {
        this.isLoadingDocs = false;
      }
    });
  }

  private fetchDocumentsSilent(name: string): void {
    this.dbService.getDocuments(name, this.searchQuery).subscribe({
      next: (res) => {
        this.documents.set(res.data.documents);
        this.totalDocumentsInCol.set(res.data.totalCount);
      }
    });
  }

  onSearchChange(): void {
    this.loadDocuments(this.selectedCollection());
  }

  copyDocJson(doc: any): void {
    try {
      navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
      this.toastService.success('Document JSON copied to clipboard!');
    } catch {
      this.toastService.info('Could not access clipboard');
    }
  }

  launchCompass(): void {
    this.dbService.launchCompass().subscribe({
      next: () => {
        this.toastService.info('Launched MongoDB Compass. Connecting to mongodb://localhost:27017...');
      },
      error: () => {
        this.toastService.info('Open MongoDB Compass and connect to mongodb://localhost:27017');
      }
    });
  }

  getCollectionIcon(name: string): string {
    switch (name) {
      case 'messages': return '💬';
      case 'users': return '👤';
      case 'connections': return '🤝';
      case 'clubs': return '🏛️';
      case 'clubmemberships': return '📜';
      case 'events': return '⚡';
      case 'notifications': return '🔔';
      case 'results': return '🏆';
      case 'announcements': return '📢';
      case 'teamposts': return '🚀';
      case 'clubapplications': return '📝';
      case 'eventregistrations': return '🎟️';
      default: return '📁';
    }
  }
}
