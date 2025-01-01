import { z } from 'zod';

const messageSchema = z.object({
  bookingId: z.number(),
  message: z.string().min(1).max(2000),
  attachments: z.array(z.string().url()).optional()
});

export function validateMessagePayload(payload: unknown): void {
  try {
    messageSchema.parse(payload);
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: 'Invalid message payload',
      cause: error
    });
  }
}