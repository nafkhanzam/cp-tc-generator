import { JSZip } from 'https://deno.land/x/jszip/mod.ts';
import * as fs from 'https://deno.land/std/fs/mod.ts';

const DIST = `tc.zip`;

export class TestCase {
  i = 1;
  _in = '';
  _out = '';
  zip = new JSZip();
  constructor() {
    if (fs.existsSync(DIST)) {
      Deno.removeSync(DIST);
    }
  }
  in(...v: unknown[]): void {
    if (this._in !== '' && !this._in.endsWith('\n')) {
      this._in += ' ';
    }
    this._in += v.join(' ');
  }
  inln(): void {
    this._in += '\n';
  }
  out(...v: unknown[]): void {
    if (this._out !== '' && !this._out.endsWith('\n')) {
      this._out += ' ';
    }
    this._out += v.join(' ');
  }
  outln(): void {
    this._out += '\n';
  }
  apply(): void {
    this.zip.addFile(`${this.i}.in`, this._in);
    this.zip.addFile(`${this.i}.out`, this._out);
    this._in = '';
    this._out = '';
    ++this.i;
  }
  async publish(): Promise<void> {
    await this.zip.writeZip(DIST);
  }
}
