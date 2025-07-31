import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from './profile.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private UserProfileSubject: BehaviorSubject<object | null> =
    new BehaviorSubject<object | null>({});
  userProfile$: Observable<any> = this.UserProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  createProfile(profileData: Profile) {
    return this.http.post(`${environment.baseUrl}/profile`, profileData);
  }

  getUserProfile() {
    return this.http.get(`${environment.baseUrl}/profile`);
  }

  setUserProfile(profileData: object) {
    this.UserProfileSubject.next(profileData);
    this.setUserProfileInLocalStorage(profileData);
  }

  private setUserProfileInLocalStorage(profileData: object): void {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }

  updateProfile(id: string, payload: Profile) {
    return this.http.patch(`${environment.baseUrl}/profile/${id}`, payload);
  }

  deleteProfile(id: Number) {
    return this.http.delete(`${environment.baseUrl}/profile/${id}`);
  }
}
