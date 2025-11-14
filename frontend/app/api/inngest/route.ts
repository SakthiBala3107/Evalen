import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
// import { syncUser, deleteUserFromDB } from "@/lib/inngest"; // import your backend functions

export const { GET, POST } = serve({
  client: inngest,
  functions: [], // <--- now they are used

  // add functions later
});
