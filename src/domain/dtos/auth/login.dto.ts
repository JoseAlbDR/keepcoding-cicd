import { Validators } from '../../../config';

interface LoginDtoProps {
  email: string;
  password: string;
}

export class LoginDto {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(props: LoginDtoProps): [string?, LoginDto?] {
    const { email, password } = props;

    if (!email) return ['Email is required'];
    if (!Validators.isValidEmail(email)) return ['Email is not a valid email'];

    if (!password) return ['Password is required'];

    return [undefined, new LoginDto(email, password)];
  }
}
