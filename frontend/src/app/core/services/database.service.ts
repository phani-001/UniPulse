import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CollectionStat {
  name: string;
  type: string;
  count: number;
}

export interface DatabaseOverview {
  databaseName: string;
  connectedUri: string;
  readyState: string;
  totalCollections: number;
  totalDocuments: number;
  timestamp: string;
  collections: CollectionStat[];
}

export interface CollectionData {
  collection: string;
  totalCount: number;
  returnedCount: number;
  documents: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/database`;

  getOverview(): Observable<{ success: boolean; data: DatabaseOverview }> {
    return this.http.get<{ success: boolean; data: DatabaseOverview }>(`${this.apiUrl}/overview`);
  }

  getDocuments(collectionName: string, search: string = ''): Observable<{ success: boolean; data: CollectionData }> {
    const params: any = { limit: 100 };
    if (search) params.search = search;
    return this.http.get<{ success: boolean; data: CollectionData }>(
      `${this.apiUrl}/collections/${collectionName}`,
      { params }
    );
  }

  launchCompass(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/launch-compass`, {});
  }
}
