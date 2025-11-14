import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: { type: String, default: "" },
    clerkId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

// app.post("/api/test-inngest", async (req, res) => {
//   try {
//     const testEvent = {
//       id: "test-id",
//       email_addresses: [{ email_address: "test@example.com" }],
//       first_name: "test-date",
//       last_name: "User-date",
//       image_url: "",
//     };

//     await inngest.send({
//       name: "clerk/user.created",
//       data: testEvent,
//     });

//     res.json({ success: true, message: "Event sent to Inngest!" });
//   } catch (err) {
//     console.error("Error sending test event:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
