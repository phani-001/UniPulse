import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Club, ClubApplication, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ClubService {
  private readonly baseUrl = `${environment.apiUrl}/clubs`;
  private readonly appUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  getClubs(params?: { search?: string; category?: string; page?: number; limit?: number }): Observable<Club[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.category && params.category !== 'All') httpParams = httpParams.set('category', params.category);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    httpParams = httpParams.set('limit', (params?.limit || 50).toString());

    return this.http.get<any>(this.baseUrl, { params: httpParams }).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.clubs)) return res.data.clubs;
        if (Array.isArray(res?.clubs)) return res.clubs;
        return [];
      })
    );
  }

  getMyClubs(): Observable<Club[]> {
    return this.http.get<any>(`${this.baseUrl}/my`).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/categories`).pipe(
      map(res => res.data || [])
    );
  }

  getClub(id: string): Observable<Club> {
    return this.http.get<ApiResponse<Club>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  leaveClub(id: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${id}/leave`, {});
  }

  applyToClub(clubId: string, reason: string, skills?: string): Observable<ClubApplication> {
    return this.http.post<ApiResponse<ClubApplication>>(`${this.appUrl}/clubs/${clubId}`, {
      reason,
      skills
    }).pipe(map(res => res.data));
  }

  getMyApplications(): Observable<ClubApplication[]> {
    return this.http.get<ApiResponse<ClubApplication[]>>(`${this.appUrl}/my`).pipe(
      map(res => res.data || [])
    );
  }
}
