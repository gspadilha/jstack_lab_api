import z from "zod";
import { HttpRequest, HttpResponse } from "../types/Https";
import { badRequest, created, unprocessableEntity } from "../utils/http";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { hash } from "bcryptjs";
import { Messages } from "../utils/messages";
import { calculateGoals } from "../libs/calculateGoals";

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

export class SignUpController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const userExistente = await db.query.usersTable.findFirst({
      columns: {
        email: true,
      },
      where: eq(usersTable.email, data.account.email),
    });

    if (userExistente) {
      return unprocessableEntity({ errors: Messages.EMAIL_JA_CADASTRADO });
    }

    const { account, ...rest } = data;

    const hashedPassword = await hash(account.password, 12);

    const goals = calculateGoals({
      height: data.height,
      weight: data.weight,
      gender: data.gender,
      birthDate: new Date(data.birthDate),
      activityLevel: data.activityLevel,
      goal: data.goal,
    });

    const [user] = await db
      .insert(usersTable)
      .values({
        ...account,
        ...rest,
        password: hashedPassword,
        ...goals,
      })
      .returning({ id: usersTable.id });

    return created({ userId: user.id });
  }
}
