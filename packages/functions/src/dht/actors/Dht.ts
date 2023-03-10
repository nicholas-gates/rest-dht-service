// create a singleton typescript class
import { client, q } from "src/lib/fauna-client";

interface PaginationOptions {
  size?: number;
  after?: any[];
}

const collection: string = "myCollection";

export const getById: (id: string) => Promise<any> = async (id: string) => {
  const resp = await client.query(q.Get(q.Ref(q.Collection(collection), id)));
  console.log(resp);
  return resp;
};

export const list: (after: string) => Promise<any> = async (after: string) => {
  const paginationOptions: PaginationOptions = {
    size: 10,
  };

  if (after) {
    paginationOptions.after = [q.Ref(q.Collection(collection), after)];
  }

  const alldocs = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("all_docs")), paginationOptions),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  );

  // extract the title from the document
  const docData = alldocs.data.map((doc: any) => doc.data);

  const nextAfter: string = alldocs?.after ? alldocs.after[0].id : null;

  return {
    docData,
    after: nextAfter,
  };
};

export const create: (data: object) => Promise<any> = async (data: object) => {
  const resp = await client.query(
    q.Create(q.Ref(q.Collection(collection), q.NewId()), {
      data: data,
    })
  );

  return resp;
};
