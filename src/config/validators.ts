import mongoose from 'mongoose';
import { ITags } from '../data/seed/seed';
import { TAGS } from './tags';

export class Validators {
  static isMongoID(id: string) {
    return mongoose.isValidObjectId(id);
  }

  static isValidTag(tags: ITags | ITags[]) {
    return (tags as ITags[]).every((tag) => TAGS.includes(tag));
  }

  static isValidPrice(price: string) {
    const regex = /^(?:(\d+)-(\d+)|(\d+)-|\-(\d+))$/;
    return regex.test(price);
  }

  static isValidEmail(email: string) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }

  static isValidPassword(password: string) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>.]{6,}$/;
    return regex.test(password);
  }
}
