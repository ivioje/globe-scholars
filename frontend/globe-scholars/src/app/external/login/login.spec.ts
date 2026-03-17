import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Login} from './login';
import {AuthService} from '../../services/auth/auth-service';
import {UserAccount} from '../../services/auth/interface';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: AuthService;
  let router: Router;

  const mockCredentials = {
    username: 'johnD',
    password: 'Password123',
  };

  const mockUserAccount: UserAccount = {
    message: 'Login successful',
    tokens: {access: 'access-token', refresh: 'refresh-token'},
    user: {
      id: 1,
      email: 'john@example.com',
      username: 'johnD',
      first_name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
      bio: '',
      affiliation: '',
      country: '',
      website: '',
      created_at: new Date(),
      upload_count: 0,
      total_reactions: 0,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form group with username and password controls', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('username')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
  });

  it('should be an invalid form when empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should validate form and show error when fields are empty', () => {
    const result = component.validateForm();
    expect(result).toBeFalse();
    expect(component.formErrorMsg).toBe('Please fill in all fields!');
  });

  it('should clear formErrorMsg when form is valid', () => {
    component.form.patchValue(mockCredentials);
    const result = component.validateForm();
    expect(result).toBeTrue();
    expect(component.formErrorMsg).toBe('');
  });

  it('should not call authService.login if form is invalid', async () => {
    spyOn(authService, 'login');
    await component.login();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login with username and password', async () => {
    spyOn(authService, 'login').and.returnValue(of(mockUserAccount));
    component.form.patchValue(mockCredentials);
    await component.login();
    expect(authService.login).toHaveBeenCalledWith(mockCredentials.username, mockCredentials.password);
  });

  it('should navigate to / on successful login', async () => {
    spyOn(authService, 'login').and.returnValue(of(mockUserAccount));
    spyOn(router, 'navigateByUrl');
    component.form.patchValue(mockCredentials);
    await component.login();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should set apiErrorMsg on login failure', async () => {
    spyOn(authService, 'login').and.returnValue(throwError(() => ({error: {error: 'Invalid credentials'}})));
    component.form.patchValue(mockCredentials);
    await component.login();
    expect(component.apiErrorMsg).toBe('Invalid credentials');
  });

  it('should capture form values correctly', () => {
    component.form.patchValue(mockCredentials);
    const values = component.form.getRawValue();
    expect(values.username).toBe(mockCredentials.username);
    expect(values.password).toBe(mockCredentials.password);
  });
});
