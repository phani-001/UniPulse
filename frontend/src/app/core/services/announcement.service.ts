import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Announcement, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private readonly baseUrl = `${environment.apiUrl}/announcements`;

  constructor(private http: HttpClient) {}

  getAnnouncements(params?: { type?: string; page?: number; limit?: number }): Observable<{
    announcements: Announcement[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> {
    let httpParams = new HttpParams();
    if (params?.type && params.type !== 'all') httpParams = httpParams.set('type', params.type);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<ApiResponse<{ announcements: Announcement[]; totalPages: number; currentPage: number; total: number }>>(
      this.baseUrl,
      { params: httpParams }
    ).pipe(map(res => res.data));
  }

  getLatestAnnouncements(): Observable<Announcement[]> {
    return this.http.get<ApiResponse<Announcement[]>>(`${this.baseUrl}/latest`).pipe(
      map(res => res.data)
    );
  }

  getAnnouncement(id: string): Observable<Announcement> {
    return this.http.get<ApiResponse<Announcement>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
