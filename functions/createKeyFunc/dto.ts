import { z } from "zod";

export interface ICreateKeyDTOReturn {
  name: string;
  ttl: number;
}

export class CreateKeyFuncDTO {
  static exec(body: any): ICreateKeyDTOReturn {
    const schema = z.object({
      name: z.string().min(2).max(255),
      ttl: z.number().min(1)
    }).strict();

    const output = schema.parse(body)
    return output
  }
}
