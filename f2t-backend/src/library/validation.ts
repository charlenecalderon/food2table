// Import ZodError so we can detect and handle validation errors from Zod
// Import ZodType so we can type our schema parameter
import { ZodError, type ZodType } from "zod";

// This function takes a Zod schema and unknown input data
// It returns data if it is correct, gets validated
// If the data is invalid, report an error
export function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  try {
    // Try to analyze and validate the body using the schema
    // If the data matches the schema, this returns the parsed (clean) data
    return schema.parse(body);
  } catch (error) {
    // If something goes wrong, check if it's a Zod validation error
    if (error instanceof ZodError) {
      // Create a new Error with a custom message
      // Attach a "details" field that lists all validation problems
      throw Object.assign(new Error("ValidationError"), {
        details: error.issues.map(issue => ({
          // Convert the error path (array) into a readable string
          path: issue.path.join("."),
          // Error message
          message: issue.message,
        })),
      });
    }

    // If it's not a Zod error, report again the original error
    throw error;
  }
}