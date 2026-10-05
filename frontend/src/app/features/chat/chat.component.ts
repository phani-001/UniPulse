import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Conversation, Message, User } from '../../core/models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            MVGRCE · STUDENT COLLABORATION NETWORK
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Peer Messaging</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time chat with your connected classmates, team members, and study partners
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a routerLink="/network" class="mvgr-btn-secondary text-xs">
            <svg class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Connect More Peers
          </a>
        </div>
      </div>

      <!-- Main Messenger Container -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[740px] max-h-[82vh]">
        
        <!-- Left Sidebar: Conversations (4 cols) -->
        <div class="lg:col-span-4 mvgr-card flex flex-col overflow-hidden h-full">
          
          <!-- Search Header -->
          <div class="p-3.5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-black/20">
            <div class="relative">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Search connected peers..."
                class="w-full px-3.5 py-2 pl-9 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 transition-all"
              />
              <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Peer List -->
          <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04]">
            @if (filteredConversations().length === 0) {
              <div class="p-8 text-center text-slate-400 text-xs space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-xl">
                  💬
                </div>
                <p class="font-bold text-slate-700 dark:text-slate-300">No conversations yet</p>
                <p class="text-[11px] max-w-[220px] mx-auto text-slate-500 dark:text-slate-400 leading-relaxed">
                  Head to the <a routerLink="/network" class="text-blue-600 dark:text-blue-400 font-semibold underline">Network</a> tab and connect with fellow MVGR students to start chatting.
                </p>
              </div>
            } @else {
              @for (conv of filteredConversations(); track conv.peer._id) {
                @let isSelected = activePeer()?._id === conv.peer._id;
                <button 
                  type="button" 
                  (click)="selectPeer(conv.peer)"
                  [ngClass]="isSelected 
                    ? 'bg-blue-50/90 dark:bg-blue-950/40 border-l-4 border-l-blue-600' 
                    : 'hover:bg-slate-50 dark:hover:bg-white/[0.03] border-l-4 border-l-transparent'"
                  class="w-full text-left p-3.5 transition-all flex items-start gap-3 relative">
                  
                  <!-- Peer Avatar -->
                  <div class="relative shrink-0">
                    <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.08] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
                      {{ getInitials(conv.peer.name) }}
                    </div>
                    <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                  </div>

                  <!-- Peer Info & Last Message -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1 mb-0.5">
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {{ conv.peer.name }}
                      </h4>
                      @if (conv.lastMessage) {
                        <span class="text-[10px] text-slate-400 shrink-0 font-mono">
                          {{ conv.lastMessage.createdAt | date:'shortTime' }}
                        </span>
                      }
                    </div>

                    <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                      {{ conv.peer.branch || 'Engineering' }} · {{ conv.peer.registrationNumber }}
                    </div>

                    <div class="flex items-center justify-between gap-2">
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        @if (conv.lastMessage) {
                          <span *ngIf="conv.lastMessage.isMine" class="text-slate-400">You: </span>
                          {{ conv.lastMessage.content }}
                        } @else {
                          <span class="text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">✨ Connected peer</span>
                        }
                      </p>

                      @if (conv.unreadCount > 0) {
                        <span class="shrink-0 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          {{ conv.unreadCount }}
                        </span>
                      }
                    </div>
                  </div>

                </button>
              }
            }
          </div>

        </div>

        <!-- Right Main Panel: Active Chat Thread (8 cols) -->
        <div class="lg:col-span-8 mvgr-card flex flex-col overflow-hidden h-full">
          
          @if (!activePeer()) {
            <!-- Empty Placeholder -->
            <div class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div class="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl shadow-sm">
                💬
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Direct Peer Messaging</h3>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
                  Select a student from the conversation list to coordinate hackathon ideas, share class notes, or discuss club activities.
                </p>
              </div>

              <div class="max-w-md p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-left text-xs space-y-1.5">
                <span class="font-bold text-blue-600 dark:text-blue-400 font-mono text-[11px] uppercase tracking-wider block">
                  ⚡ College Privacy Guard
                </span>
                <p class="text-slate-600 dark:text-slate-300">
                  Only students with accepted mutual connections can send and receive messages.
                </p>
              </div>
            </div>
          } @else {
            
            <!-- Active Peer Header -->
            <div class="p-3.5 sm:p-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-black/20">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.08] border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
                  {{ getInitials(activePeer()?.name || '') }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white">{{ activePeer()?.name }}</h3>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      ✓ Connected
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {{ activePeer()?.branch || 'MVGR Student' }} · Year {{ activePeer()?.year || 1 }} · {{ activePeer()?.registrationNumber }}
                  </p>
                </div>
              </div>

              <!-- Header Actions -->
              <div class="flex items-center gap-2">
                <button 
                  type="button" 
                  (click)="refreshCurrentChat()"
                  class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                  title="Refresh chat messages">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Messages Thread Area -->
            <div id="messageContainer" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/20 dark:bg-black/10">
              
              @if (messages().length === 0) {
                <div class="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <span class="text-4xl">👋</span>
                  <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Start a conversation with {{ activePeer()?.name }}
                  </p>
                  <p class="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                    Say hello or pick a quick topic below to get started!
                  </p>
                </div>
              } @else {
                @for (msg of messages(); track msg._id) {
                  @let isMine = isMyMessage(msg);
                  
                  <div class="flex flex-col" [ngClass]="isMine ? 'items-end' : 'items-start'">
                    
                    <!-- Bubble -->
                    <div class="max-w-[80%] sm:max-w-[70%] px-4 py-2.5 text-xs shadow-sm leading-relaxed"
                      [ngClass]="isMine ? 'chat-bubble-mine' : 'chat-bubble-peer'">
                      <p class="whitespace-pre-wrap break-words">{{ msg.content }}</p>
                    </div>

                    <!-- Timestamp and Status -->
                    <div class="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400 font-mono">
                      <span>{{ msg.createdAt | date:'shortTime' }}</span>
                      @if (isMine) {
                        <span>{{ msg.isRead ? '· ✓✓ Read' : '· ✓ Sent' }}</span>
                      }
                    </div>

                  </div>
                }
              }

            </div>

            <!-- Quick Suggestion Chips -->
            <div class="px-4 py-2 bg-slate-50/60 dark:bg-black/20 border-t border-slate-100 dark:border-white/[0.04] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
              <span class="text-[10px] text-slate-400 font-mono uppercase shrink-0">Quick:</span>
              <button 
                type="button" 
                (click)="sendQuickPrompt('Hey! Want to team up for the hackathon? 🚀')"
                class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-300 shrink-0 transition-colors">
                Team up for hackathon? 🚀
              </button>
              <button 
                type="button" 
                (click)="sendQuickPrompt('Do you have the class notes for Unit 3? 📚')"
                class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-300 shrink-0 transition-colors">
                Share Unit 3 notes? 📚
              </button>
              <button 
                type="button" 
                (click)="sendQuickPrompt('Are you attending the upcoming club session? ⏱️')"
                class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-300 shrink-0 transition-colors">
                Attending club session? ⏱️
              </button>
            </div>

            <!-- Message Input Form -->
            <div class="p-3 sm:p-4 border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#10172a]">
              <form (ngSubmit)="onSendMessage()" class="flex items-center gap-2">
                <input 
                  type="text" 
                  [(ngModel)]="newMessageText" 
                  name="messageText"
                  placeholder="Type a message to {{ activePeer()?.name }}... (Press Enter)"
                  class="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />

                <button 
                  type="submit" 
                  [disabled]="!newMessageText.trim() || isSending()"
                  class="mvgr-btn-primary py-2.5 px-4 disabled:opacity-40 text-xs shrink-0 cursor-pointer">
                  <span>{{ isSending() ? 'Sending...' : 'Send' }}</span>
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>

          }

        </div>

      </div>

    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy {
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  currentUserId = () => this.authService.user()?._id;

  conversations = this.messageService.conversations;
  messages = this.messageService.activeMessages;
  activePeer = this.messageService.activePeer;

  searchQuery = '';
  newMessageText = '';
  isSending = signal(false);
  private pollInterval: any;

  ngOnInit(): void {
    // Load conversations list
    this.messageService.fetchConversations().subscribe({
      next: (res) => {
        const peerParam = this.route.snapshot.queryParams['peer'];
        if (peerParam) {
          const match = res.data.find(c => c.peer._id === peerParam);
          if (match) {
            this.selectPeer(match.peer);
          } else {
            this.messageService.fetchMessages(peerParam).subscribe({
              next: () => this.scrollToBottom()
            });
          }
        } else if (res.data && res.data.length > 0 && !this.activePeer()) {
          // Auto-select first peer so chat window is never empty!
          this.selectPeer(res.data[0].peer);
        }
      }
    });

    // Auto-refresh poll every 6s for active chat thread
    this.pollInterval = setInterval(() => {
      const peer = this.activePeer();
      if (peer) {
        this.messageService.fetchMessages(peer._id).subscribe();
      }
    }, 6000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  filteredConversations(): Conversation[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.conversations();
    return this.conversations().filter(c => 
      c.peer.name.toLowerCase().includes(q) ||
      (c.peer.branch && c.peer.branch.toLowerCase().includes(q)) ||
      c.peer.registrationNumber.toLowerCase().includes(q)
    );
  }

  selectPeer(peer: User): void {
    this.messageService.fetchMessages(peer._id).subscribe({
      next: () => {
        this.scrollToBottom();
      }
    });
  }

  refreshCurrentChat(): void {
    const peer = this.activePeer();
    if (peer) {
      this.messageService.fetchMessages(peer._id).subscribe({
        next: () => {
          this.toastService.info('Messages refreshed');
          this.scrollToBottom();
        }
      });
    }
  }

  onSendMessage(): void {
    const text = this.newMessageText.trim();
    const peer = this.activePeer();
    if (!text || !peer || this.isSending()) return;

    this.isSending.set(true);
    this.messageService.sendMessage(peer._id, text).subscribe({
      next: () => {
        this.newMessageText = '';
        this.isSending.set(false);
        this.scrollToBottom();
      },
      error: (err) => {
        this.isSending.set(false);
        this.toastService.error(err.error?.message || 'Failed to send message');
      }
    });
  }

  sendQuickPrompt(text: string): void {
    this.newMessageText = text;
    this.onSendMessage();
  }

  isMyMessage(msg: Message): boolean {
    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
    return senderId === this.currentUserId();
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.getElementById('messageContainer');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
