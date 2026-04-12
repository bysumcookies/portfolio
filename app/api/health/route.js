export async function GET() {
    return Response.json({
      ok: true,
      service: "portfolio-next-api",
      step: "health route works",
    });
  }