import { Validators } from '../../../config';

interface SignupDtoProps {
  name: string;
  email: string;
  password: string;
}

export class SignupDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(props: SignupDtoProps): [string?, SignupDto?] {
    const { name, email, password } = props;

    if (!name) return ['Name is required'];
    if (!email) return ['Email is required'];
    if (!Validators.isValidEmail(email)) return ['Email is not a valid email'];
    if (!password) return ['Password is required'];
    if (!Validators.isValidPassword(password))
      return [
        'Invalid password, password must be at least 6 characters long and contain numbers, symbols, and upper case and lower case characters',
      ];

    return [undefined, new SignupDto(name, email, password)];
  }
}
