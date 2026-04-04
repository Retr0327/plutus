interface Snapshot<T> {
  current: T[];
  initial: T[];
  new: T[];
  removed: T[];
  modified: T[];
}

abstract class Collection<T> {
  #current: T[] = [];
  #initial: T[] = [];
  #new: T[] = [];
  #removed: T[] = [];
  #modified: T[] = [];

  constructor(initial?: T[]) {
    if (Array.isArray(initial)) {
      this.#current = Array.from(initial);
      this.#initial = Array.from(initial);
    }
  }

  abstract isSameItem(a: T, b: T): boolean;

  get items(): T[] {
    return Array.from(this.#current);
  }

  get newItems(): T[] {
    return Array.from(this.#new);
  }

  get removedItems(): T[] {
    return Array.from(this.#removed);
  }

  get modifiedItems(): T[] {
    return Array.from(this.#modified);
  }

  #isModified(item: T): boolean {
    return this.#modified.find((v) => this.isSameItem(v, item)) !== undefined;
  }

  #isCurrent(item: T): boolean {
    return this.#current.find((v) => this.isSameItem(v, item)) !== undefined;
  }

  #isNew(item: T): boolean {
    return this.#new.find((v) => this.isSameItem(v, item)) !== undefined;
  }

  #isRemoved(item: T): boolean {
    return this.#removed.find((v) => this.isSameItem(v, item)) !== undefined;
  }

  #isInitial(item: T): boolean {
    return this.#initial.find((v) => this.isSameItem(v, item)) !== undefined;
  }

  exists(item: T): boolean {
    return this.#isCurrent(item);
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.#current.find(predicate);
  }

  clear(): void {
    this.#current = [];
  }

  hasChanges(): boolean {
    return (
      this.#new.length > 0 ||
      this.#removed.length > 0 ||
      this.#modified.length > 0
    );
  }

  add(item: T): void {
    if (this.#isRemoved(item)) {
      this.#removed = this.#removed.filter((v) => !this.isSameItem(v, item));
    }
    if (!this.#isNew(item) && !this.#isInitial(item)) {
      this.#new.push(item);
    }
    if (!this.#isCurrent(item)) {
      this.#current.push(item);
    }
  }

  remove(item: T): void {
    this.#current = this.#current.filter((v) => !this.isSameItem(v, item));
    if (this.#isNew(item)) {
      this.#new = this.#new.filter((v) => !this.isSameItem(v, item));
      return;
    }
    if (this.#isModified(item)) {
      this.#modified = this.#modified.filter((v) => !this.isSameItem(v, item));
    }
    if (!this.#isRemoved(item)) {
      this.#removed.push(item);
    }
  }

  update(item: T): boolean {
    const index = this.#current.findIndex((v) => this.isSameItem(v, item));
    if (index === -1) {
      return false;
    }
    this.#current[index] = item;
    const newIndex = this.#new.findIndex((v) => this.isSameItem(v, item));
    if (newIndex !== -1) {
      this.#new[newIndex] = item;
      return true;
    }
    const modifiedIndex = this.#modified.findIndex((v) =>
      this.isSameItem(v, item),
    );
    if (modifiedIndex === -1) {
      this.#modified.push(item);
    } else {
      this.#modified[modifiedIndex] = item;
    }
    return true;
  }

  createSnapshot(): Snapshot<T> {
    return {
      current: Array.from(this.#current),
      initial: Array.from(this.#initial),
      new: Array.from(this.#new),
      removed: Array.from(this.#removed),
      modified: Array.from(this.#modified),
    };
  }

  restoreSnapshot(snapshot: Snapshot<T>): void {
    this.#current = Array.from(snapshot.current);
    this.#initial = Array.from(snapshot.initial);
    this.#new = Array.from(snapshot.new);
    this.#removed = Array.from(snapshot.removed);
    this.#modified = Array.from(snapshot.modified);
  }
}

export default Collection;
