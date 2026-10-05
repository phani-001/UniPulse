import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Connection, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private readonly baseUrl = `${environment.apiUrl}/connections`;

  constructor(private http: HttpClient) {}

  getMyConnections(): Observable<Connection[]> {
    return this.http.get<ApiResponse<Connection[]>>(`${this.baseUrl}/my`).pipe(
      map(res => res.data)
    );
  }

  getIncomingRequests(): Observable<Connection[]> {
    return this.http.get<ApiResponse<Connection[]>>(`${this.baseUrl}/requests/incoming`).pipe(
      map(res => res.data)
    );
  }

  getOutgoingRequests(): Observable<Connection[]> {
    return this.http.get<ApiResponse<Connection[]>>(`${this.baseUrl}/requests/outgoing`).pipe(
      map(res => res.data)
    );
  }

  getConnectionStatus(userId: string): Observable<{ status: string; connectionId?: string }> {
    return this.http.get<ApiResponse<{ status: string; connectionId?: string }>>(`${this.baseUrl}/status/${userId}`).pipe(
      map(res => res.data)
    );
  }

  sendRequest(userId: string, note?: string): Observable<Connection> {
    return this.http.post<ApiResponse<Connection>>(`${this.baseUrl}/request/${userId}`, { note }).pipe(
      map(res => res.data)
    );
  }

  respondToRequest(connectionId: string, action: 'accept' | 'reject'): Observable<Connection> {
    return this.http.patch<ApiResponse<Connection>>(`${this.baseUrl}/${connectionId}/respond`, { action }).pipe(
      map(res => res.data)
    );
  }
}
