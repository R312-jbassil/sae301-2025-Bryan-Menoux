export async function GET({ cookies }) {
  cookies.delete("pb_auth", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
