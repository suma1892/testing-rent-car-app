export interface IRequestPayload<T> {
  skip: number;
  take: number;
  sorts: {
    compare: 'string';
    field: 'string';
    dir: 'string';
  }[];
  filter: T;
}
