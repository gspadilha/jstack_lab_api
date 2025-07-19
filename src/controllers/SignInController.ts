import { HttpRequest, HttpResponse } from "../types/Https";
import { badRequest, ok } from "../utils/http";

import { z } from "zod";

const schema = z.object({
  goal: z.enum(["perder", "manter", "ganhar"]),
  gender: z.enum(["masculino", "feminino"]),
  birthDate: z.iso.date(),
  height: z.number().max(250),
  weight: z.number().max(500),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string().min(5),
    email: z.email(),
    password: z.string().min(8),
  }),
});

export class SignInController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    return ok({ accessToken: "token" });
  }
}
