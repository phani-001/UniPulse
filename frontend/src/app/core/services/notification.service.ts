import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  private _unreadCount = signal<number>(0);
  readonly unreadCount = this._unreadCount.asReadonly();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<ApiResponse<Notification[]>>(this.baseUrl).pipe(
      map(res => res.data),
      tap(notifications => {
        const unread = notifications.filter(n => !n.isRead).length;
        this._unreadCount.set(unread);
      })
    );
  }

  fetchUnreadCount(): Observable<number> {
    return this.http.get<ApiResponse<{ count: number }>>(`${this.baseUrl}/unread-count`).pipe(
      map(res => res.data.count),
      tap(count => this._unreadCount.set(count))
    );
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<ApiResponse<Notification>>(`${this.baseUrl}/${id}/read`, {}).pipe(
      map(res => res.data),
      tap(() => {
        this._unreadCount.update(c => Math.max(0, c - 1));
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.baseUrl}/read-all`, {}).pipe(
      map(res => res.data),
      tap(() => this._unreadCount.set(0))
    );
  }
}
