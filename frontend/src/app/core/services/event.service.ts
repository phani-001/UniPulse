import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Event, EventRegistration, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(params?: { search?: string; type?: string; status?: string; page?: number; limit?: number }): Observable<Event[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.type && params.type !== 'all') httpParams = httpParams.set('type', params.type);
    if (params?.status && params.status !== 'all') httpParams = httpParams.set('status', params.status);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    httpParams = httpParams.set('limit', (params?.limit || 50).toString());

    return this.http.get<any>(this.baseUrl, { params: httpParams }).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.events)) return res.data.events;
        if (Array.isArray(res?.events)) return res.events;
        return [];
      })
    );
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<ApiResponse<Event[]>>(`${this.baseUrl}/upcoming`).pipe(
      map(res => res.data)
    );
  }

  getMyRegistrations(): Observable<EventRegistration[]> {
    return this.http.get<ApiResponse<EventRegistration[]>>(`${this.baseUrl}/my-registrations`).pipe(
      map(res => res.data)
    );
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<ApiResponse<Event>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  registerForEvent(id: string, payload?: { teamName?: string; teamMembers?: string[] }): Observable<EventRegistration> {
    return this.http.post<ApiResponse<EventRegistration>>(`${this.baseUrl}/${id}/register`, payload || {}).pipe(
      map(res => res.data)
    );
  }

  cancelRegistration(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}/register`).pipe(
      map(res => res.data)
    );
  }
}
