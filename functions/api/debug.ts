export async function onRequest(context: any) {
  try {
    const { results } = await context.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
