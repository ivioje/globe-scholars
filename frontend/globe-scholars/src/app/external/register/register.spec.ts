import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Register} from './register';
import {AuthService} from '../../services/auth/auth-service';
import {NewUser} from '../../services/auth/interface';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {of} from 'rxjs';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authService: AuthService;

  const newUser: NewUser = {
    first_name: 'John',
    last_name: 'Doe',
    username: 'johnD',
    password: 'Password123',
    password2: 'Password123'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form group with controls', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('first_name')).toBeDefined();
    expect(component.form.get('last_name')).toBeDefined();
    expect(component.form.get('username')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
    expect(component.form.get('password2')).toBeDefined();
  });

  it('should validate form and show error when invalid', () => {
    component.validateForm();
    expect(component.formErrorMsg).toBe('Please fill in all the fields!');
  });

  it('should not call the register method if the form is invalid', () => {
    spyOn(authService, 'register');
    component.register();
    expect(authService.register).not.toHaveBeenCalled();
  })

  it('should capture form values in params object', () => {
    component.form.patchValue(newUser);

    const params = component.form.getRawValue();
    expect(params.first_name).toBe(newUser.first_name);
    expect(params.last_name).toBe(newUser.last_name);
    expect(params.username).toBe(newUser.username);
    expect(params.password).toBe(newUser.password);
    expect(params.password2).toBe(newUser.password2);
  });

  it('should pass params to authService.register', () => {
    spyOn(authService, 'register').and.returnValue(of({
      message: 'success',
      tokens: {access: 'token', refresh: 'refresh'},
      user: {username: 'johnD'}
    } as any));
    component.form.patchValue(newUser);
    component.register();
    expect(authService.register).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should validate password pattern', () => {
    component.password?.setValue('hello');
    expect(component.password?.hasError('pattern')).toBeTrue();
    component.password?.setValue('Password123');
    expect(component.password?.hasError('pattern')).toBeFalse();
  });
});
