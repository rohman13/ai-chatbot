import { v4 as uuidv4 } from "uuid";

import { auth } from "@/app/(auth)/auth";
import { getAgents, getAgentById, deleteAgentById, saveAgent } from "@/db/queries";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized!", { status: 401 });
  }

  const url = new URL(request.url);
  const agentId = url.searchParams.get("agentId");

  if (agentId) {
    const agent = await getAgentById({ id: agentId });
    return new Response(JSON.stringify(agent), { status: 200 });
  } else {
    const agents = await getAgents();
    return new Response(JSON.stringify(agents), { status: 200 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const agentId = url.searchParams.get("agentId");

  if (!agentId) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await deleteAgentById({ id: agentId });
    return new Response("Agent deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  const { id, name, functions, active, systemPrompt } = await request.json();

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const agentId = id || uuidv4();

  try {
    await saveAgent({ id: agentId, name, functions, active, systemPrompt });
    return new Response("Agent updated", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}