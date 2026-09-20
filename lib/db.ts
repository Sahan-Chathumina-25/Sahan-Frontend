import type { ContactInput } from "@/lib/validation";

/**
 * Persistence hook for contact messages.
 * Run `npm run prisma:migrate` to create the SQLite DB, then extend this
 * function with a real PrismaClient write. Until then it is a validated
 * no-op so builds and the contact API work without a database.
 */
export async function persistContactMessage(input: ContactInput): Promise<void> {
  void input;
  return Promise.resolve();
}
