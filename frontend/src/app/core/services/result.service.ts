import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Result, ApiResponse } from '../models';

export interface StudentLeaderboardEntry {
  _id: string;
  name: string;
  registrationNumber: string;
  branch: string;
  year: number;
  photo?: string;
  points: number;
  badge?: string;
}

export interface ClubLeaderboardEntry {
  _id: string;
  name: string;
  category: string;
  logo?: string;
  totalPoints: number;
  winsCount: number;
}

@Injectable({ providedIn: 'root' })
export class ResultService {
  private readonly baseUrl = `${environment.apiUrl}/results`;

  constructor(private http: HttpClient) {}

  getWeeklyResults(): Observable<Result[]> {
    return this.http.get<ApiResponse<Result[]>>(`${this.baseUrl}/weekly`).pipe(
      map(res => res.data)
    );
  }

  getResultHistory(): Observable<Result[]> {
    return this.http.get<ApiResponse<Result[]>>(`${this.baseUrl}/history`).pipe(
      map(res => res.data)
    );
  }

  getStudentLeaderboard(): Observable<StudentLeaderboardEntry[]> {
    return this.http.get<ApiResponse<StudentLeaderboardEntry[]>>(`${this.baseUrl}/leaderboard/students`).pipe(
      map(res => res.data)
    );
  }

  getClubLeaderboard(): Observable<ClubLeaderboardEntry[]> {
    return this.http.get<ApiResponse<ClubLeaderboardEntry[]>>(`${this.baseUrl}/leaderboard/clubs`).pipe(
      map(res => res.data)
    );
  }
}
