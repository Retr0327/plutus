import { AggregateRoot as EventAggregateRoot } from '@nestjs/cqrs';

export abstract class Entity<Id, Props> extends EventAggregateRoot {
  readonly id: Id;
  protected props: Props;

  protected constructor(id: Id, props: Props) {
    super();
    this.id = id;
    this.props = props;
  }

  public abstract equals(obj?: Entity<Id, Props>): boolean;
}
