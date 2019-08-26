export class WildCardContainer {
  private readonly _data?: string[];

  public get count(): number {
    return !this._data ? 0 : this._data.length;
  }

  public get isWildcard(): boolean {
    return !this._data || this._data.length === 0;
  }

  private constructor(...data: string[]) {
    this._data = data;
  }

  public static from(...data: string[]): WildCardContainer {
    return new WildCardContainer(...data);
  }

  public static fromWildcard(): WildCardContainer {
    return new WildCardContainer();
  }

  public static fromSerialized(methods: "*" | string[]): WildCardContainer {
    if (methods === "*") {
      return WildCardContainer.fromWildcard();
    } else {
      return WildCardContainer.from(...methods);
    }
  }

  public export() {
    return this.isWildcard ? "*" : this._data!;
  }
}
