import { remove } from 'fs-extra';
import { threadId } from 'worker_threads';

export class FsAdapter {
  constructor(public name: string = '') {}
  static async rmdir(path: string) {
    try {
      await remove(path);
    } catch (error) {
      throw error;
    }
  }

  test() {
    return this.name;
  }
}

FsAdapter.rmdir('');

const adapter = new FsAdapter();

adapter.test();
