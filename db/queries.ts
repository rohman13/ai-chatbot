"server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { user, chat, User, agent } from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!} `);
let db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function getAgents() {
  try {
    return await db
      .select({
        id: agent.id,
        createdAt: agent.createdAt,
        name: agent.name,
        functions: agent.functions,
        active: agent.active
      })
      .from(agent);
  } catch (error) {
    console.error("Failed to get agents from database");
    throw error;
  }
}

export async function getAgentById({ id }: { id: string }) {
  try {
    const [selectedAgent] = await db
      .select()
      .from(agent)
      .where(eq(agent.id, id));
    return selectedAgent;
  } catch (error) {
    console.error("Failed to get agent by id from database");
    throw error;
  }
}

export async function saveAgent({
  id,
  name,
  functions,
  active,
  systemPrompt,
}: {
  id: string;
  name: string;
  functions: string;
  active: number;
  systemPrompt: string;
}) {
  try {
    const selectedAgents = await db.select().from(agent).where(eq(agent.id, id));

    if (selectedAgents.length > 0) {
      return await db
        .update(agent)
        .set({
          name,
          functions,
          active,
          systemPrompt,
        })
        .where(eq(agent.id, id));
    }

    return await db.insert(agent).values({
      id,
      createdAt: new Date(),
      name,
      functions,
      active,
      systemPrompt,
    });
  } catch (error) {
    console.error("Failed to save agent in database");
    throw error;
  }
}

export async function deleteAgentById({ id }: { id: string }) {
  try {
    return await db.delete(agent).where(eq(agent.id, id));
  } catch (error) {
    console.error("Failed to delete agent by id from database");
    throw error;
  }
}