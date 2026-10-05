import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`).pipe(
      map(res => res.data)
    );
  }

  updateMyProfile(payload: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/me`, payload).pipe(
      map(res => res.data)
    );
  }

  uploadPhoto(file: File): Observable<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<ApiResponse<{ photoUrl: string }>>(`${this.baseUrl}/me/photo`, formData).pipe(
      map(res => res.data)
    );
  }

  discoverStudents(params?: { search?: string; branch?: string; year?: number; skill?: string; page?: number; limit?: number }): Observable<User[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.branch && params.branch !== 'All') httpParams = httpParams.set('branch', params.branch);
    if (params?.year) httpParams = httpParams.set('year', params.year.toString());
    if (params?.skill) httpParams = httpParams.set('skill', params.skill);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    httpParams = httpParams.set('limit', '50');

    return this.http.get<any>(`${this.baseUrl}/discover`, { params: httpParams }).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.students)) return res.data.students;
        if (Array.isArray(res?.students)) return res.students;
        return [];
      })
    );
  }

  getSuggestedStudents(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/suggested`).pipe(
      map(res => res.data)
    );
  }

  getStudentProfile(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
