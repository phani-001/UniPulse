import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TeamPost, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class TeamPostService {
  private readonly baseUrl = `${environment.apiUrl}/team-posts`;

  constructor(private http: HttpClient) {}

  getTeamPosts(params?: { eventId?: string; search?: string; skill?: string; page?: number }): Observable<TeamPost[]> {
    let httpParams = new HttpParams();
    if (params?.eventId) httpParams = httpParams.set('eventId', params.eventId);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.skill) httpParams = httpParams.set('skill', params.skill);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    httpParams = httpParams.set('limit', '50');

    return this.http.get<any>(this.baseUrl, { params: httpParams }).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.posts)) return res.data.posts;
        if (Array.isArray(res?.posts)) return res.posts;
        return [];
      })
    );
  }

  getMyTeamPosts(): Observable<TeamPost[]> {
    return this.http.get<ApiResponse<TeamPost[]>>(`${this.baseUrl}/my`).pipe(
      map(res => res.data)
    );
  }

  createTeamPost(payload: Partial<TeamPost>): Observable<TeamPost> {
    return this.http.post<ApiResponse<TeamPost>>(this.baseUrl, payload).pipe(
      map(res => res.data)
    );
  }

  getTeamPost(id: string): Observable<TeamPost> {
    return this.http.get<ApiResponse<TeamPost>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  respondToTeamPost(id: string, message: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${id}/respond`, { message }).pipe(
      map(res => res.data)
    );
  }

  deleteTeamPost(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
