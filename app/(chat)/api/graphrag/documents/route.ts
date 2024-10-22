import axios from "axios";

import { auth } from "@/app/(auth)/auth";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }
  const graphrag_url = process.env.BASE_URL_GRAPHRAG;
  const documents = await axios.get(
    `${graphrag_url}/documents`,
  );
  return Response.json(documents.data);
}
