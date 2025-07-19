import { eq } from "drizzle-orm";
import { db } from "../db";
import { HttpRequest, HttpResponse } from "../types/Https";
import { badRequest, ok, unauthorized } from "../utils/http";

import { compare } from "bcryptjs";

import { z } from "zod";
import { usersTable } from "../db/schema";
import { Messages } from "../utils/messages";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export class SignInController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const userExistente = await db.query.usersTable.findFirst({
      columns: {
        id: true,
        email: true,
        password: true,
      },
      where: eq(usersTable.email, data.email),
    });

    if (!userExistente) {
      return unauthorized({ errors: Messages.CREDENCIAL_INVALIDAS });
    }

    const passwordValido = await compare(data.password, userExistente.password);

    if (!passwordValido) {
      return unauthorized({ errors: Messages.CREDENCIAL_INVALIDAS });
    }

    return ok({ accessToken: "token" });
  }
}
