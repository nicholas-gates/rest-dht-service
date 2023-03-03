// create a singleton typescript class
import { client, q } from "src/lib/fauna-client";

interface PaginationOptions {
  size?: number;
  after?: any[];
}

const collection: string = "myCollection";

export const getById: (id: string) => Promise<any> = async (id: string) => {
  const dbdoc = await client.query(q.Get(q.Ref(q.Collection(collection), id)));

  const doc = flattenDoc(dbdoc);
  console.log(doc);
  return doc;
};

export const list: (after: string) => Promise<any> = async (after: string) => {
  const paginationOptions: PaginationOptions = {
    size: 10,
  };

  if (after) {
    paginationOptions.after = [q.Ref(q.Collection(collection), after)];
  }

  const dbdocs = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("all_docs")), paginationOptions),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  );

  const allDocsFlattened = dbdocs.data.map(flattenDoc);

  const nextAfter: string = dbdocs?.after ? dbdocs.after[0].id : null;
  const nextBefore: string = dbdocs?.before ? dbdocs.before[0].id : null;

  return {
    docs: allDocsFlattened, // alldocs.data,
    after: nextAfter,
    before: nextBefore,
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

const flattenDoc = (doc: any) => {
  return {
    ...doc.data,
    ...{
      id: doc.ref.value.id,
    },
  };
}