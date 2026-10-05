import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Conversation, Message, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/messages`;

  unreadCount = signal<number>(0);
  conversations = signal<Conversation[]>([]);
  activeMessages = signal<Message[]>([]);
  activePeer = signal<User | null>(null);
  isLoading = signal<boolean>(false);

  fetchConversations(): Observable<ApiResponse<Conversation[]>> {
    return this.http.get<ApiResponse<Conversation[]>>(`${this.apiUrl}/conversations`).pipe(
      tap(res => {
        if (res.success) {
          this.conversations.set(res.data);
          const totalUnread = res.data.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
          this.unreadCount.set(totalUnread);
        }
      })
    );
  }

  fetchMessages(peerId: string): Observable<ApiResponse<{ peer: User; messages: Message[] }>> {
    this.isLoading.set(true);
    return this.http.get<ApiResponse<{ peer: User; messages: Message[] }>>(`${this.apiUrl}/${peerId}`).pipe(
      tap(res => {
        this.isLoading.set(false);
        if (res.success) {
          this.activePeer.set(res.data.peer);
          this.activeMessages.set(res.data.messages);
          // Decrease local unread count for this peer
          this.fetchUnreadCount().subscribe();
        }
      })
    );
  }

  sendMessage(peerId: string, content: string): Observable<ApiResponse<Message>> {
    return this.http.post<ApiResponse<Message>>(`${this.apiUrl}/${peerId}`, { content }).pipe(
      tap(res => {
        if (res.success) {
          this.activeMessages.update(msgs => [...msgs, res.data]);
          // Update conversation list snippet
          this.conversations.update(convs => {
            return convs.map(c => {
              if (c.peer._id === peerId) {
                return {
                  ...c,
                  lastMessage: {
                    content: res.data.content,
                    createdAt: res.data.createdAt,
                    isMine: true,
                    isRead: false
                  }
                };
              }
              return c;
            });
          });
        }
      })
    );
  }

  fetchUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.http.get<ApiResponse<{ count: number }>>(`${this.apiUrl}/unread-count`).pipe(
      tap(res => {
        if (res.success) {
          this.unreadCount.set(res.data.count);
        }
      })
    );
  }
}
