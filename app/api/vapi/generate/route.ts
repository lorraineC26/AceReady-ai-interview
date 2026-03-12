export async function GET() {
  return Response.json(
    { success: true, data: "Hello from VAPI!" },
    { status: 200 },
  );
}
